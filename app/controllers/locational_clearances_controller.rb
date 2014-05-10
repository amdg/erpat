class LocationalClearancesController < ApplicationController
  after_action :verify_authorized, except: [:new, :create, :index, :queued, :list, :approve, :reject]
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

  def approve
    lc = LocationalClearance.find(params[:id])
    lc.update_attribute(:status, LocationalClearance.statuses[:approved])
    render :json => {status: 'success'}
  end

  def reject
    lc = LocationalClearance.find(params[:id])
    lc.update_attribute(:status, LocationalClearance.statuses[:rejected])
    render :json => {status: 'success'}
  end

  def inspect
    lc = LocationalClearance.find(params[:id])
    params.permit(:inspector_note)
    lc.update_attribute(:inspector_note, params[:inspector_note])
    if params[:inspector_decision] == 0
      lc.update_attribute(:status, LocationalClearance.statuses[:inspected])
    else
      lc.update_attribute(:status, LocationalClearance.statuses[:rejected])
    end
    render :json => {status: 'success'}
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
