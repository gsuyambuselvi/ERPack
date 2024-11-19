(function ($) {
    let _userService = abp.services.app.user,
        l = abp.localization.getSource('ERPack'),
        _$modal = $('#UserCreateModal'),
        _$form = _$modal.find('form'),
        _$table = $('#UsersTable');

    let _$usersTable = _$table.DataTable({
        paging: true,
        ordering: true,
        searching: true,
        listAction: {
            ajaxFunction: _userService.getAll,
            inputFilter: function () {
                return $('#UsersSearchForm').serializeFormToObject(true);
            }
        },
        buttons: [
            {
                name: 'refresh',
                text: '<i class="fas fa-redo-alt"></i>',
                action: () => _$usersTable.draw(false)
            }
        ],
        scrollX: !0,
        select: {
            style: 'multi'
        },
        order: [[1, 'asc']],
        columnDefs: [
            {
                targets: 0,
                defaultContent: '',
                checkboxes: {
                    selectRow: true
                },
                sortable: false
            },
            {
                targets: 1,
                data: 'userName'
            },
            {
                targets: 2,
                data: 'fullName'
            },
            {
                targets: 3,
                data: 'emailAddress'
            },
            {
                targets: 4,
                data: 'mobile'
            },
            {
                targets: 5,
                data: 'dob',
                "render": function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return date.getDate() + "/" + (month.toString().length > 1 ? month : "0" + month) + "/" + date.getFullYear();
                }
            },
            {
                targets: 6,
                data: 'gender'
            },
            {
                targets: 7,
                data: 'address1'
            },
            {
                targets: 8,
                data: 'address2'
            },
            {
                targets: 9,
                data: 'city'
            },
            {
                targets: 10,
                data: 'state'
            },
            {
                targets:11,
                data: 'pinCode'
            },
            {
                targets: 12,
                data: 'country'
            },
            {
                targets: 13,
                data: 'designation'
            },
            {
                targets: 14,
                data: 'doj',
                "render": function (data) {
                    let date = new Date(data);
                    let month = date.getMonth() + 1;
                    return date.getDate() + "/" + (month.toString().length > 1 ? month : "0" + month) + "/" + date.getFullYear();
                }
            },
            {
                targets: 15,
                data: 'isActive',
                render: data => `<input type="checkbox" disabled ${data ? 'checked' : ''}>`
            },
            {
                targets: 16,
                data: null,
                sortable: false,
                autoWidth: false,
                defaultContent: '',
                render: (data, type, row, meta) => {
                    return [
                        `   <button type="button" class="btn btn-sm bg-secondary edit-user" data-user-id="${row.id}">`,
                        `       <i class="fas fa-pencil-alt"></i> ${l('Edit')}`,
                        '   </button>',
                        `   <button type="button" class="btn btn-sm bg-danger delete-user" data-user-id="${row.id}" data-user-name="${row.name}">`,
                        `       <i class="fas fa-trash"></i> ${l('Delete')}`,
                        '   </button>'
                    ].join('');
                }
            }
        ]
    });

    $(document).on('click', '.delete-user', function () {
        let userId = $(this).attr("data-user-id");
        let userName = $(this).attr('data-user-name');

        deleteUser(userId, userName);
    });

    function deleteUser(userId, userName) {
        abp.message.confirm(
            abp.utils.formatString(
                l('AreYouSureWantToDelete'),
                userName),
            null,
            (isConfirmed) => {
                if (isConfirmed) {
                    _userService.delete({
                        id: userId
                    }).done(() => {
                        abp.notify.info(l('SuccessfullyDeleted'));
                        _$usersTable.ajax.reload();
                    });
                }
            }
        );
    }

    $(document).on('click', '.edit-user', function (e) {
        let userId = $(this).attr("data-user-id");
        e.preventDefault();
        window.location.href = '/Users/CreateUser?userId=' + userId;
    });

    $(document).on('change ', '.selectAll input[type="checkbox"]', function (e) {
        if (this.checked == true) {
            $('#bulkActions').show();
        }
        else if (this.checked == false) {
            $('#bulkActions').hide();
        }
    });

    $('.btn-search').on('click', (e) => {
        _$usersTable.ajax.reload();
    });

    $('.txt-search').on('keypress', (e) => {
        if (e.which == 13) {
            _$usersTable.ajax.reload();
            return false;
        }
    });
})(jQuery);

function fnCreatePdf() {
    event.preventDefault();
    var tabledata = $("#UsersTable").html();
    let obj = {};
    obj.Name = "UserList";
    obj.Html = tabledata;
    let data = JSON.stringify(obj);
    $.ajax({
        type: "POST",
        url: "/Common/GeneratePdf",
        data: data,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.success == true) {
                window.open(response.result.data, "_blank");
            }
        },
        error: function () {

        }
    });
}

function fnCreateCSV() {
    event.preventDefault();
    var tabledata = $("#UsersTable").html();
    let obj = {};
    obj.Name = "UserList";
    obj.Html = tabledata;
    let data = JSON.stringify(obj);
    $.ajax({
        type: "POST",
        url: "/Common/GenerateExcel",
        data: data,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.success == true) {
                window.open(response.result.data, "_blank");
            }
        },
        error: function () {

        }
    });
}