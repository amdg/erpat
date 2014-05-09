class LocationalClearancesController < ApplicationController
  respond_to :pdf
  
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
  end

  private

  def sanitized_params
    params.permit(:full_name, :contact_number, :street_address, :lat, :long, :purpose, :land_use)
  end
end
