(function ($) {
  var _$estimatesTable = $("#EstimatesTable");
  var _$enquiryTable = "";
  l = abp.localization.getSource("ERPack");
  $(function () {
    $('#enqTab a[href="#Enquiry"]').click();
  });
  $(document).on("click", "#enqTab li", function () {
      let ActiveTab = $(this).find("a").attr("href");
      $(".chkFile").prop('checked', false)
    switch (ActiveTab) {
      case "#Enquiry":
        enquiryTBlList();
        break;
      default:
        estimateTblList();
        break;
    }
  });
  var _estimateService = abp.services.app.estimate;

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  //Estimate Table (Edit)
  function estimateTblList() {
    _$table = $("#EstimatesTable");
    _$estimatesTable = _$table.DataTable({
      paging: true,
      destroy: true,
      ordering: true,
      searching: true,
      listAction: {
        ajaxFunction: _estimateService.getAll,
      },
      dom: '<"top d-flex justify-content-between  align-items-center"Bf>t<"bottom border-top pt-2  d-flex justify-content-between"i l p><"clear">',
      pagingType: "full_numbers",
      buttons: [
        {
          extend: "pdfHtml5",
              className: "btn btn-secondary exportpdf mr-3 rounded",
          text: '<i class="fas fa-file-pdf"></i> PDF',
          title: "Completed Designs",
          orientation: "portrait", // Optional: 'portrait' or 'landscape'
          pageSize: "A4", // Optional: PDF page size
          exportOptions: {
              columns: ":visible", // Export only visible columns
              rows: function (idx, data, node) {
                    return $(node).find(".chkFile").prop("checked");  // Include only rows with checked checkboxes
              },
              },

        },
        {
          extend: "excelHtml5",
            className: "btn btn-secondary exportpdf rounded",
          text: '<i class="fas fa-file-excel"></i> Excel', // Excel icon with color
          title: "Completed Designs", // Title for the Excel file
          exportOptions: {
              columns: ":visible", // Export only visible columns
              rows: function (idx, data, node) {
                    return $(node).find(".chkFile").prop("checked");  // Include only rows with checked checkboxes
              }, 
          },
        },
        //{
        //    name: 'refresh',
        //   className: 'btn btn-light',
        //    text: '<i class="fas fa-redo-alt fa-lg"></i>',
        //    action: () => _$estimatesTable.draw(false)
        //}
        ],
        initComplete: function () {

            $('.buttons-excel').hide();
            $('.buttons-pdf').hide();
        },
      responsive: {
        details: {
          type: "column",
        },
      },
      order: [[2, "asc"]],
      columnDefs: [
        {
          targets: 0,
          className: "control",
          orderable: false,
          searchable: false,
          defaultContent:
            '<input type="checkbox" tblId="EstimatesTable" class="chkFile select-checkbox">',
        },
        {
          targets: 1,
          className: "dt-control",
          defaultContent: "",
          //defaultContent: '<i class="fas fa-angle-down fa-sm" style="color: #7a7a7a;"></i>',
          sortable: false,
        },
        {
          targets: 2,
          data: "estimateId",
        },
        {
          targets: 3,
          data: "customerName",
        },
        {
          targets: 4,
          data: "totalAmount",
        },
        {
          targets: 5,
          data: "creationTime",
          render: function (data, type, row, meta) {
            return app.htmlUtils.formatDate(data);
          },
        },
        {
          targets: 6,
          data: null,
          sortable: false,
          autoWidth: false,
          defaultContent: "",
          render: (data, type, row, meta) => {
            return `<a class="edit-estimate" data-estimate-id="${row.id}" data-toggle="tooltip" data-placement="top" title="Edit">
                                 <i class="fas fa-edit fa-lg"></i>
                                 </a>`;
          },
        },
      ],
    });

    // Reinitialize tooltips after each draw
    _$estimatesTable.on("draw.dt", function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  // Enquiry table (New Estimate)
  function enquiryTBlList() {
    var _enquiryService = abp.services.app.design;
    _$enquiryTable = $("#EnquiryTable").DataTable({
      paging: true,
      ordering: true,
      destroy: true,
      searching: true,
      listAction: {
        ajaxFunction: _enquiryService.getCompletedDesigns,
      },

      dom: '<"top d-flex justify-content-between align-items-center"Bf>t<"bottom border-top pt-2  d-flex justify-content-between"ilp><"clear">',
      pagingType: "full_numbers",
      buttons: [
        {
          extend: "pdfHtml5",
              className: "btn  btn-secondary exportpdf mr-3 rounded",
          text: '<i class="fas fa-file-pdf"></i> PDF',
          title: "Completed Designs",
          orientation: "portrait", // Optional: 'portrait' or 'landscape'
          pageSize: "A4", // Optional: PDF page size
          exportOptions: {
              columns: ":visible", // Export only visible columns
              rows: function (idx, data, node) {
                  return $(node).find(".chkFile").prop("checked"); // Include only rows with checked checkboxes
              },
              },
        },
        {
          extend: "excelHtml5",
            className: "btn btn-secondary exportpdf rounded",
          text: '<i class="fas fa-file-excel"></i> Excel', // Excel icon with color
          title: "Completed Designs", // Title for the Excel file
          exportOptions: {
              columns: ":visible",  // Export only visible columns
              rows: function (idx, data, node) {
                    return $(node).find(".chkFile").prop("checked"); // Include only rows with checked checkboxes
              },             
            },
          

          //{
          //    name: 'refresh',
          //    className: 'btn btn-light',
          //    text: '<i class="fas fa-redo-alt fa-lg"></i>',
          //    action: () => _$enquiryTable.draw(false)
          //}
          },

        ],
        initComplete: function () {
            // Initial check to toggle button visibility
            var table = this.api(); // DataTable instance
            table.rows().every(function () {
                var rowNode = this.node();
                var anyChecked = $(rowNode).find(".chkFile").prop("checked");
                if (anyChecked) {
                    table.buttons().container().find('.buttons-excel').show();
                    table.buttons().container().find('.buttons-pdf').show();
                    return false; // Stop further checks if one is found checked
                }
            });

            // Default state: hide buttons
            $('.buttons-excel').hide();
            $('.buttons-pdf').hide();
        },
        //initComplete: function () {

        //    $('.buttons-excel').hide();
        //    $('.buttons-pdf').hide();
        //},
      responsive: {
        details: {
          type: "column",
        },
      },
      order: [[1, "asc"]],
      columnDefs: [
        {
          targets: 0,
          className: "control",
          orderable: false,
          searchable: false,
          defaultContent:
            '<input type="checkbox" tblId="EnquiryTable" class="chkFile select-checkbox">',
        },
        {
          targets: 1,
          data: "enquiryNumber",
        },
        {
          targets: 2,
          data: "designId",
        },
        {
          targets: 3,
          data: "isHighPriority",
          render: function (data) {
            if (data === true) {
              return '<lable class="badge badge-danger font-weight-normal">High Priority</lable>';
            } else {
              return "";
            }
          },
        },
        {
          targets: 4,
          data: "completionDatetime",
          render: function (data, type, row, meta) {
            return app.htmlUtils.formatDate(data);
          },
        },
        {
          targets: 5,
          data: null,
          sortable: false,
          autoWidth: false,
          width: "50px",
          defaultContent: "",
          render: (data, type, row, meta) => {
            return ` <a href="Estimate?designId=${row.id}" designId="${data.Id}"  data-toggle="tooltip" data-placement="top" title="New Estimate">
                    <i class="fas fa-plus-circle fa-sm"></i>      
                    </a>`;
          },
        },
        ],
       
    });
    // Reinitialize tooltips after each draw
    _$enquiryTable.on("draw.dt", function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  // Add event listener for opening and closing details
  _$estimatesTable.on("click", "td.dt-control", function (e) {
    let tr = e.target.closest("tr");
    let row = _$estimatesTable.row(tr);
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
    } else {
      // Open this row
      format(row);
    }
  });
    $(document).on('change', "#EnquiryTable .chkFile,#EstimatesTable .chkFile", function () {
        var tblid = $(this).attr('tblId');
        var anyChecked = $('#' + tblid + ' .chkFile:checked').length > 0;
        if (anyChecked) {
            $('#' + tblid).DataTable().buttons().container().find('.buttons-excel').show();
            $('#' + tblid).DataTable().buttons().container().find('.buttons-pdf').show();
        } else {
            $('#' + tblid).DataTable().buttons().container().find('.buttons-excel').hide();
            $('#' + tblid).DataTable().buttons().container().find('.buttons-pdf').hide();
        }
    })

  // Formatting function for row details - modify as you need
  $("#selectEst").on("click", function () {
    var checkboxes = $("#EstimatesTable .select-checkbox");
    checkboxes.prop("checked", this.checked);
  });
  $("#selectEnq").on("click", function () {
    var checkboxes = $("#EnquiryTable .select-checkbox");
    checkboxes.prop("checked", this.checked);
  });

  function format(row) {
    let estimateId = row.data().id;
    let html = `<table id="EstimateTasksTable" class="table table-sm border nowrap">
                                    <thead  class="thead-light">
                                        <tr>
                                            <th>Material</th>
                                            <th>Quantity</th>
                                            <th>Unit</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>CGST</th>
                                            <th>SGST</th>
                                            <th>IGST</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                <tbody id="tblVal">`;
    let estimateTasks;
    if (estimateId) {
      $.ajax({
        url: `/CRM/GetEstimateTasks?estimateId=${estimateId}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
          estimateTasks = response.result.data;
          $(estimateTasks).each(function () {
            html += "<tr>";
            html += "<td>" + this.materialName + "</td>";
            html += "<td>" + this.qty + "</td>";
            html += "<td>" + this.sellingUnitName + "</td>";
            html += "<td>" + this.price + "</td>";
            html += "<td>" + this.discountPercentage + "</td>";
            html += "<td>" + this.cgst + "</td>";
            html += "<td>" + this.sgst + "</td>";
            html += "<td>" + this.igst + "</td>";
            html += "<td>" + this.amount + "</td>";
            html += "</tr>";
          });
          html += "</tbody>";
          html += "</table>";

          row.child(html).show();
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.error("Error:", status, error);
        },
      });
    }
  }

  $(document).on("click", ".delete-estimate", function () {
    var estimateId = $(this).attr("data-estimate-id");
    var estimateName = $(this).attr("data-estimate-name");

    deleteEstimate(estimateId, estimateName);
  });

  function deleteEstimate(estimateId, estimateName) {
    var _estimateService = abp.services.app.estimate;
    abp.message.confirm(
      abp.utils.formatString(l("AreYouSureWantToDelete"), estimateName),
      null,
      (isConfirmed) => {
        if (isConfirmed) {
          _estimateService
            .delete({
              id: estimateId,
            })
            .done(() => {
              abp.notify.info(l("SuccessfullyDeleted"));
              _$estimatesTable.ajax.reload();
            });
        }
      }
    );
  }

  $(document).on("click", ".edit-estimate", function (e) {
    var estimateId = $(this).attr("data-estimate-id");
    e.preventDefault();
    window.location.href = "/CRM/Estimate?estimateId=" + estimateId;
  });

  $(".btn-search").on("click", (e) => {
    _$estimatesTable.ajax.reload();
  });

  $(".txt-search").on("keypress", (e) => {
    if (e.which == 13) {
      _$estimatesTable.ajax.reload();
      return false;
    }
  });
})(jQuery);
