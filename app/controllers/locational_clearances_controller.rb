class LocationalClearancesController < ApplicationController
  before_filter :authenticate_user!, :only => [:list]
  after_action :verify_authorized, except: [:new, :create, :index, :queued, :list]
  respond_to :pdf

  def index
  end

  def list
    @applications = policy_scope(LocationalClearance)
    respond_to do |format|
      format.json { render json: LocationalClearance.all }
      format.html
    end
  end
  
  def queued
    queued_clearances = LocationalClearance.queued.inject([]) do |lcs, lc|
      lcs << {
          'id' => lc.id.to_s,
          'lat' => lc.lat.to_s,
          'long' => lc.long.to_s,
          'full_name' => lc.full_name || '',
          'purpose' => lc.purpose || '',
          'address' => lc.address || ''}
      lcs
    end
    respond_to do |format|
      format.json {
        render :json => queued_clearances
      }
    end
  end


  def new
  end

  def create
    status = 'fail'
    @lc = LocationalClearance.new(sanitized_params)
    status = 'success' if @lc.save

    respond_to do |format|
      format.js {
        render :json => {status: status, lc_id: @lc.persisted? ? @lc.id : nil}
      }
    end
  end

  def show
    @lc = LocationalClearance.find(params[:id])
    authorize @lc
    respond_to do |format|
      format.json { render json: @lc }
      format.html
    end
  end

  private

  def sanitized_params
    params.permit(:full_name, :contact_number, :address, :lat, :long, :purpose, :land_use)
  end
end
