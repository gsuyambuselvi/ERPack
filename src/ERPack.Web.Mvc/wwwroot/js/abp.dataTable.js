
var abp = abp || {};
(function () {
    if (!$.fn.dataTable) {
        return;
    }

    abp.libs = abp.libs || {};
    var l = abp.localization.getSource("ERPack");

    var language = {
        emptyTable: "No data available in table",
        info: "_START_-_END_ of _TOTAL_ items",
        infoEmpty: "No records",
        infoFiltered: "(filtered from _MAX_ total entries)",
        infoPostFix: "",
        infoThousands: ",",
        lengthMenu: "Show _MENU_ entries",
        loadingRecords: "Loading...",
        processing: '<i class="fas fa-refresh fa-spin"></i>',
        search: "",
        zeroRecords: "No matching records found",
        paginate: {
            first: '<i class="fas fa-angle-double-left fa-xs"style="color: #b0b0b0;"></i>',
            last: '<i class="fas fa-angle-double-right fa-xs" style="color: #b0b0b0;"></i>',
            next: '<i class="fas fa-chevron-right fa-xs" style="color: #b0b0b0;"></i>',
            previous: '<i class="fas fa-chevron-left fa-xs" style="color: #b0b0b0;"></i>',
        },
        aria: {
            sortAscending: ": activate to sort column ascending",
            sortDescending: ": activate to sort column descending",
        },
    };

    $.extend(true, $.fn.dataTable.defaults, {
        searching: true,  // Enable searching
        ordering: false,
        language: language,
        processing: true,
        autoWidth: false,
        responsive: true,
        dom: [
            "<'row'<'col-md-12 mt-1'f>>",
            "<'row'<'col-md-12't>>",
            "<'row mt-2'",
            "<'col-lg-1 col-xs-12'<'float-left text-center data-tables-refresh'B>>",
            "<'col-lg-3 col-xs-12'<'float-left text-center'i>>",
            "<'col-lg-3 col-xs-12'<'text-center'l>>",
            "<'col-lg-5 col-xs-12'<'float-right'p>>",
            ">",
        ].join(""),
    });

    // Wait until DataTable is initialized, then add the placeholder
    $(document).on('init.dt', function () {
        // Ensure the search input element exists before setting the placeholder
        $('.dataTables_filter input').attr('placeholder', 'Search');
    });
})();
