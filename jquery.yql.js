/*
 * jQuery YQL plugin
 *
 * Copyright (c) 2010 Gabriel Falcão
 * Copyright (c) 2010 Lincoln de Sousa
 * licensed under MIT license.
 *
 * http://github.com/gabrielfalcao/jquery-yql/raw/master/license.txt
 *
 * Version: 0.3.0
 */

/*
 use
 var jsonResult = $.yql("select * from html where url= #{url}", "{url:"http://www.google.com}");
 var jsonResultS = $.myql(["select tables", "select tables"});
*/
(function ($) {
    $.extend({
        _prepareYQLQuery: function (query, params) {
            $.each(
            params, function (key) {
                var name = "#{" + key + "}";
                var value = $.trim(this);
                if (!value.match(/^[0-9]+$/)) {
                    value = '"' + value + '"';
                }
                while (query.search(name) > -1) {
                    query = query.replace(name, value);
                }

                var name = "@" + key;
                var value = $.trim(this);
                if (!value.match(/^[0-9]+$/)) {
                    value = '"' + value + '"';
                }
                while (query.search(name) > -1) {
                    query = query.replace(name, value);
                }

            });
            return query;
        },
        yql: function () {
            var query = arguments[0];

            var $self = this;
            var successCallback = null;
            var errorCallback = null;

            if (typeof arguments[1] == 'object') {
                query = $self._prepareYQLQuery(query, arguments[1]);
                successCallback = arguments[2];
                errorCallback = arguments[3];
            } else if (typeof arguments[1] == 'function') {
                successCallback = arguments[1];
                errorCallback = arguments[2];
            }

            var doAsynchronously = successCallback != null;
            var yqlJson = {
                url: "http://query.yahooapis.com/v1/public/yql",
                dataType: "jsonp",
                success: function(result){
                    if(result.error != null && errorCallback != null)
                        errorCallback(result);
                    else if(successCallback != null)
                        successCallback(result);
                },
                async: doAsynchronously,
                data: {
                    q: query,
                    format: "json",
                    env: 'store://datatables.org/alltableswithkeys',
                    callback: "?"
                }
            }

            if (errorCallback) {
                yqlJson.error = errorCallback;
            }

            $.ajax(yqlJson);
            return $self.toReturn;
        },
        myql: function () {
            var multiQuery = "select * from yql.query.multi where queries='" + arguments[0].join(";") + "'";
            $.yql(multiQuery, arguments[1], arguments[2], arguments[3]);
        }
    });
})(jQuery);
