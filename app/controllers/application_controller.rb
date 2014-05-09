class ApplicationController < ActionController::Base
  include Pundit
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  helper_method :controller_namespace, :namespaced_controller_name, :namespaced_controller_action

  def initialize_flashes
    flash[:alert] ||= []
    flash[:notice] ||= []
    flash[:success] ||= []
  end

  def controller_namespace
    self.class.controller_namespace
  end

  def namespaced_controller_name
    self.class.namespaced_controller_name
  end

  def self.controller_namespace
    @controller_namespace ||= controller_name == namespaced_controller_name ? nil : namespaced_controller_name.sub(/\.#{controller_name}$/, '')
  end

  def self.namespaced_controller_name
    @namespaced_controller_name ||= name.sub(/Controller$/, '').underscore.gsub(/\//, '.')
  end

  def namespaced_controller_action
    "#{namespaced_controller_name}.#{params[:action].to_s}"
  end
  
  private

  def user_not_authorized
    flash[:alert] = "Access denied."
    redirect_to (request.referrer || root_path)
  end

end
