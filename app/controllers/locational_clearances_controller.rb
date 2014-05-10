class LocationalClearancesController < ApplicationController
  after_action :verify_authorized, except: [:new, :create, :index, :queued]
  respond_to :pdf

  def index
  end

  def list
    @applications = policy_scope(LocationalClearance)
    render json: @applications
  end
  
  def queued
    # respond_to do |format|
    #   format.json {
    #     render :json => LocationalClearance.queued
    #   }
    # end
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
  end

  private

  def sanitized_params
    params.permit(:full_name, :contact_number, :address, :lat, :long, :purpose, :land_use)
  end
end
