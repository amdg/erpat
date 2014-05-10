module ApplicationHelper

  def display_base_errors resource
    return '' if (resource.errors.empty?) or (resource.errors[:base].empty?)
    messages = resource.errors[:base].map { |msg| content_tag(:p, msg) }.join
    html = <<-HTML
    <div class="alert alert-error alert-block">
      <button type="button" class="close" data-dismiss="alert">&#215;</button>
      #{messages}
    </div>
    HTML
    html.html_safe
  end

  def application_options(applications)
    # These are the only valid titles accepted by eWay
    applications.inject([]) do |apps, app|
      apps << [app.full_name, app.id]
    end
  end

  def large_empty_placeholder(text=nil)
    haml_tag :div, class: 'jumbotron center' do
      haml_tag :p, class: 'text-muted' do
        haml_concat 'Nothing Here'
      end
    end
  end
end
