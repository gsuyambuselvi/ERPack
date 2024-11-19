var app = app || {};
(function () {    

    app.htmlUtils = {
        htmlEncodeText: function (value) {
            return $("<div/>").text(value).html();
        },

        htmlDecodeText: function (value) {
            return $("<div/>").html(value).text();
        },

        htmlEncodeJson: function (jsonObject) {
            return JSON.parse(app.htmlUtils.htmlEncodeText(JSON.stringify(jsonObject)));
        },

        htmlDecodeJson: function (jsonObject) {
            return JSON.parse(app.htmlUtils.htmlDecodeText(JSON.stringify(jsonObject)));
        },
        formatDate: function (date) {
            var d = new Date(date);
            var day = ("0" + d.getDate()).slice(-2);
            var month = d.toLocaleString('default', { month: 'short' });
            var year = d.getFullYear();
            var hours = ("0" + d.getHours()).slice(-2);
            var minutes = ("0" + d.getMinutes()).slice(-2);
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        }
    };
        
})();