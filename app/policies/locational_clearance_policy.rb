class LocationalClearancePolicy < Struct.new(:user, :record)
  class Scope < Struct.new(:user, :scope)
    def resolve
      if user.nil?
        scope.none
      elsif user.admin?
        scope.all
      elsif user.inspector?
        scope.where(status: LocationalClearance.statuses[:queued])
      elsif user.approving_officer?
        scope.where(status: LocationalClearance.statuses[:inspected])
      else
        scope.none
      end
    end
  end

  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    @user.admin? or @user.inspector? or @user.approving_officer?
  end

  def show?
    if @user.nil?
      @record.created_at > 5.minutes.ago
    else
      @user.admin? or @user.inspector? or @user.approving_officer?
    end
  end

  def update?
    @user.admin? or @user.inspector? or @user.approving_officer?
  end

  def destroy?
    @user.admin?
  end
end
