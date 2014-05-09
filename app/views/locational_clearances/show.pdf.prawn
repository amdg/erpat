pdf.stroke_horizontal_rule
pdf.pad_top(20) { pdf.text "Locational Clearance Application LC-#{@lc.created_at.year}-#{@lc.id}" }
pdf.pad_bottom(20) { pdf.text @lc.created_at.strftime("%d/%m/%Y") }
pdf.stroke_horizontal_rule

pdf.pad_top(20) { pdf.text "Name" }
pdf.text "#{@lc.first_name} #{@lc.last_name.upcase}"

if @lc.mobile
  pdf.pad_top(20) { pdf.text "Mobile No." }
  pdf.text @lc.mobile
end

pdf.pad_top(20) { pdf.text "Address" }
pdf.text @lc.address

pdf.pad_top(20) { pdf.text "Purpose" }
pdf.text @lc.purpose