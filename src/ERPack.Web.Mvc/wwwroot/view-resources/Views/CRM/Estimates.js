(function ($) {
    var _$estimatesTable = $('#EstimatesTable'); var _$enquiryTable = "";
    l = abp.localization.getSource('ERPack');
    $(function () {
        $('#enqTab a[href="#Enquiry"]').click();
    });
    $(document).on("click", "#enqTab li", function () {
        let ActiveTab = $(this).find("a").attr("href");
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
    function estimateTblList() {
        _$table = $('#EstimatesTable');
        _$estimatesTable = _$table.DataTable({
            paging: true,
            destroy: true,
            ordering: true,
            searching: true,
            listAction: {
                ajaxFunction: _estimateService.getAll,
            },
            buttons: [
                {
                    name: 'refresh',
                    className: 'refresh-btn',
                    text: '<i class="fas fa-redo-alt"></i>',
                    action: () => _$estimatesTable.draw(false)
                }

            ],
            responsive: {
                details: {
                    type: 'column'
                }
            },
            order: [[1, 'asc']],
            columnDefs: [
                {
                    targets: 0,
                    className: 'control',
                    orderable: false,
                    searchable: false,
                    defaultContent: '<input type="checkbox" tblId="EstimatesTable" class="chkFile select-checkbox">'

                },
                {
                    targets: 1,
                    className: 'dt-control',
                    defaultContent: '',
                    sortable: false,
                },
                {
                    targets: 2,
                    data: 'estimateId'
                },
                {
                    targets: 3,
                    data: 'customerName'
                },
                {
                    targets: 4,
                    data: 'totalAmount'
                },
                {
                    targets: 5,
                    data: 'creationTime',
                    render: function (data, type, row, meta) {
                        return app.htmlUtils.formatDate(data);
                    }
                },
                {
                    targets: 6,
                    data: null,
                    sortable: false,
                    autoWidth: false,
                    defaultContent: '',
                    render: (data, type, row, meta) => {
                        return ` <button type="button" class="btn btn-sm bg-secondary edit-estimate" data-estimate-id="${row.id}">
                            <i class="fas fa-pencil-alt"></i>
                            </button>`
                    }
                }
            ]
        });
    }

    function enquiryTBlList() {
        var _enquiryService = abp.services.app.design;
        _$enquiryTable = $('#EnquiryTable').DataTable({
            paging: true,
            ordering: true,
            destroy: true,
            searching: true,
            listAction: {
                ajaxFunction: _enquiryService.getCompletedDesigns,

            },
            buttons: [
                {
                    name: 'refresh',
                    //className: 'refresh-btn',
                    text: '<i class="fas fa-redo-alt"></i>',
                    action: () => _$enquiryTable.draw(false)
                }

            ],
            responsive: {
                details: {
                    type: 'column'
                }
            },
            order: [[1, 'asc']],
            columnDefs: [
                {
                    targets: 0,
                    className: 'control',
                    orderable: false,
                    searchable: false,
                    defaultContent: '<input type="checkbox" tblId="EnquiryTable" class="chkFile select-checkbox">'
                },
                {
                    targets: 1,
                    data: 'enquiryId'
                },
                {
                    targets: 2,
                    data: 'designId'
                },
                {
                    targets: 3,
                    data: 'isHighPriority',
                    render: function (data) {
                        if (data === true) {
                            return '<p class="blink_text">High Priority</p>';
                        }
                        else {
                            return '';
                        }
                    }
                },
                {
                    targets: 4,
                    data: 'completionDatetime',
                    render: function (data, type, row, meta) {
                        return app.htmlUtils.formatDate(data);
                    }
                },
                {
                    targets: 5,
                    data: null,
                    sortable: false,
                    autoWidth: false,
                    width: '50px',
                    defaultContent: '',
                    render: (data, type, row, meta) => {
                        return ` <a href="Estimate?designId=${row.id}" class="btn bg-blue float-sm-right" designId="${data.Id}">
                    <i class="fas fa-plus"></i>                    
                    </a>`
                    }
                }
            ]

        });
    }

    // Add event listener for opening and closing details
    _$estimatesTable.on('click', 'td.dt-control', function (e) {
        let tr = e.target.closest('tr');
        let row = _$estimatesTable.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        }
        else {
            // Open this row
            format(row);
        }
    });

    // Formatting function for row details - modify as you need
    $('#selectEst').on('click', function () {
        var checkboxes = $('#EstimatesTable .select-checkbox');
        checkboxes.prop('checked', this.checked);
    });
    $('#selectEnq').on('click', function () {
        var checkboxes = $('#EnquiryTable .select-checkbox');
        checkboxes.prop('checked', this.checked);
    });
    function format(row) {
        let estimateId = row.data().id;
        let html = `<table id="EstimateTasksTable" class="table table-striped table-bordered nowrap">
                                    <thead>
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
                }
            });
        }
    }

    $(document).on('click', '.delete-estimate', function () {
        var estimateId = $(this).attr("data-estimate-id");
        var estimateName = $(this).attr('data-estimate-name');

        deleteEstimate(estimateId, estimateName);
    });

    function deleteEstimate(estimateId, estimateName) {
        var _estimateService = abp.services.app.estimate;
        abp.message.confirm(
            abp.utils.formatString(
                l('AreYouSureWantToDelete'),
                estimateName),
            null,
            (isConfirmed) => {
                if (isConfirmed) {
                    _estimateService.delete({
                        id: estimateId
                    }).done(() => {
                        abp.notify.info(l('SuccessfullyDeleted'));
                        _$estimatesTable.ajax.reload();
                    });
                }
            }
        );
    }

    $(document).on('click', '.edit-estimate', function (e) {
        var estimateId = $(this).attr("data-estimate-id");
        e.preventDefault();
        window.location.href = '/CRM/Estimate?estimateId=' + estimateId;
    });

    $('.btn-search').on('click', (e) => {
        _$estimatesTable.ajax.reload();
    });

    $('.txt-search').on('keypress', (e) => {
        if (e.which == 13) {
            _$estimatesTable.ajax.reload();
            return false;
        }
    });
})(jQuery);
