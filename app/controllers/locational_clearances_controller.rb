class LocationalClearancesController < ApplicationController
  after_action :verify_authorized, except: [:new, :create, :index]
  respond_to :pdf

  def index

  end

  def list
    @applications = policy_scope(LocationalClearance)
    render json: @applications
  end
  
  def queued
    respond_to do |format|
      format.json {
        render :json => LocationalClearance.queued.to_json
      }
    end
  end

  def index

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
    # TODO Obfuscate access URL and restrict anonymous access to within 5 minutes of creating the record
    @lc = LocationalClearance.find(params[:id])
    authorize @lc
  end

  private

  def sanitized_params
    params.permit(:full_name, :contact_number, :address, :lat, :long, :purpose, :land_use)
  end
end
