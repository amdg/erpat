class LocationalClearancesController < ApplicationController
  respond_to :pdf
  
  def new
  end

  def create
    @lc = LocationalClearance.new(sanitized_params)
    @lc.save
    redirect_to @lc
  end

  def show
    # TODO Obfuscate access URL and restrict anonymous access to within 5 minutes of creating the record
    @lc = LocationalClearance.find(params[:id])
  end

  private

  def sanitized_params
    params.require(:locational_clearance).permit(:first_name, :last_name, :mobile, :address, :coordinates)
  end
end
