exports.crossdomainXML = function () {
    return '<?xml version="1.0" encoding="UTF-8"?>'+
           '<cross-domain-policy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.adobe.com/xml/schemas/PolicyFileSocket.xsd">'+
           '    <allow-access-from domain="*" to-ports="*" secure="false" />'+
           '    <site-control permitted-cross-domain-policies="all" />'+
           '</cross-domain-policy>\n';
}