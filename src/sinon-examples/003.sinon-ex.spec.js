//import * as $ from 'jquery';
var $ = require('jquery');
var expect = require('chai').expect

$.ajax = function(obj) {}

var sinon = require('sinon')
/**
* @fileoverview - Player model's Unit-Test specifications(Jasmine).
*/

describe("Sinon Test Suite", function() {
    beforeEach(function() {
            console.log("--------- Suite  before each IT -----------");
    });
    var foo = 10;
    var callbacks = {
            succ: function(data) {
                    console.log("Success! " + data);
            },
            fail: function(data) {
                    console.log("Failure! " + data);
            }
    };
    function getProduct(id, succ, fail) {
            $.ajax({
                    type: "GET",
                    url: "/products/" + id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: succ,
                    error: fail
            });
    };
    function getChannel(id, succ,fail) {
            $.ajax({
                    type: "GET",
                    url: "http://1.2.3.4/products/" + id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: succ,
                    error: fail
            });
    };
    it("Should spy on existing obj", function(){
            var spy = sinon.spy($,'ajax');
            var spy_cb_s = sinon.spy(callbacks,'succ');
            var spy_cb_f = sinon.spy(callbacks,'fail');
            getProduct('123',callbacks.succ, callbacks.fail);
            waits(1000);
            runs(function() {
                    expect(spy.called).toBeTruthy();
                    //expect(spy.getCall(0).args[0]).toEqual("/products/123");
                    expect(spy_cb_s.called).not.toBeTruthy();
                    expect(spy_cb_f.called).toBeTruthy();
                    expect(spy.getCall(0).args[0]['url']).toEqual("/products/123");
                    spy.restore();
                    spy_cb_s.restore();
                    spy_cb_f.restore();
            });


    });

    it("Should spyon ajax callback ", function(){
            var spy = sinon.spy();
            var spy2 = sinon.spy();
            getProduct('123',spy,spy2);
            waits(1000);
            runs(function() {
                    expect(spy2.called).toBeTruthy();
            });

    });
    it("Should stub on callback ", function(){
            var spy = sinon.spy();
            var stub = sinon.stub().throws();
            getProduct('123',spy,stub);
            waits(1000);
            runs(function() {
                    expect(stub.called).toBeTruthy();
            });

    });
    it("Should stub on object  ", function(){
            var spy = sinon.spy();
            var stub = sinon.stub(callbacks,"fail").throws();
            getProduct('123',callbacks.succ,callbacks.fail);
            waits(1000);
            runs(function() {
                    expect(stub.called).toBeTruthy();
                    stub.restore();
            });

    });
    it("Should mock on object  ", function(){
            var spy = sinon.spy();
            var mock = sinon.mock(callbacks);
            //mock.expects("fail").once().throws();
            mock.expects("fail").once();
            //mock.expects("succ").once();
            getProduct('123',callbacks.succ,callbacks.fail);
            waits(1000);
            runs(function() {
                    mock.verify();
                    mock.restore();
            });

    });
    it("Should fake XHR on object  ", function(){
            console.log("spying");
            var spy = sinon.spy();
            this.xhr = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];
            this.xhr.onCreate = function (xhr) {
                    console.log("On create");
                    requests.push(xhr);
            };
            getProduct('123',spy,callbacks.fail);
            console.log(this.requests[0].status);
            console.log(this.requests[0].url);
            this.requests[0].respond(200, { "Content-Type": "apllication/json"},
                                     '[{"id":12, "comments": "Herry say"}]');

            expect(spy.calledWith([{id:12,comments: "Herry say"}])).toEqual(true);;
            //waits(1000);
            //runs(function() {
            //      expect(spy.calledWith([{id:12,comments: "Herry say"}])).toEqual(true);;
            //
            //});

    });
    it("Fake server Get product detail succ", function() {
            this.server = sinon.fakeServer.create();
            this.server.autoRespond = true;
            var cb = sinon.spy();
            var cb2 = sinon.spy();
            getProduct("1234",cb,cb2);
            // respondWith(method, url, response)
            // respondWith(method,urlRegExp, response)
            //this.server.respondWith("GET", "/products/1234",
            //                      [200, {"Content-Type": "application/json"},
            //                      '{"id":123,"title":"Hollywood - Part 2"}']);
            // respondWith(urlRegExp, response)
            this.server.respondWith(/product/,
                                    [200, {"Content-Type": "application/json"},
                                    '{"id":123,"title":"Hollywood - Part 2"}']);
            this.server.respond();
            expect(cb.called).toBeTruthy();
            //expect(cb2.called).toBeTruthy();
            //expect(cb.getCall(0).args[1]).toEqual('error');
            expect(cb.getCall(0).args[1]).toEqual('success');
            //expect(cb2.getCall(0).args[1]).toEqual('success');
            //expect(cb.getCall(0).args[2]).toEqual('Not Found');
            //expect(JSON.stringify(cb.getCall(0).args[2]['responseText']))
            expect(JSON.parse(cb.getCall(0).args[2]['responseText']))
            .toEqual({
                    id: 123,
                    title: "Hollywood - Part 2"
            });
    });

    it("Fake server Get product detail fail", function() {
            this.server = sinon.fakeServer.create();
            var cb = sinon.spy();
            var cb2 = sinon.spy();
            this.server.respondWith("GET", "/products/123",
                                    [200, {"Content-Type": "application/json"},
                                    '{"id":123,"title":"Hollywood - Part 2"}']);
            getProduct("1234",cb,cb2);
            this.server.respond();
            expect(cb.called).not.toBeTruthy();
            expect(cb2.called).toBeTruthy();
            expect(cb2.getCall(0).args[1]).toEqual('error');
            expect(cb2.getCall(0).args[2]).toEqual('Not Found');
    });
    it("Fake server Get channel detail", function() {
            this.server = sinon.fakeServer.create();
            var cb = sinon.spy();
            var cb2 = sinon.spy();
            this.server.respondWith("GET", "http://1.2.3.4/products/1234",
                                    [200, {"Content-Type": "application/json"},
                                    '{"id":123,"title":"Hollywood - Part 2"}']);
            getChannel("1234",cb,cb2);
            this.server.respond();
            expect(cb.called).toBeTruthy();
            expect(cb.getCall(0).args[1]).toEqual('success');
            expect(JSON.parse(cb.getCall(0).args[2]['responseText']))
            .toEqual({
                    id: 123,
                    title: "Hollywood - Part 2"
            });
    });
    it("Fake server partial with filter Get product detail succ", function() {
            this.server = sinon.fakeServer.create();
            //HERRY: fakeServer can't be used with FakeXHR together.
            //this.xhr = sinon.useFakeXMLHttpRequest();
            //this.xhr.requestBody = "HAHA";
            //var requests = this.requests = [];
            //this.xhr.onCreate = function (xhr) {
            //      console.log("On create");
            //      requests.push(xhr);
            //};
            sinon.FakeXMLHttpRequest.useFilters = true;
            sinon.FakeXMLHttpRequest.addFilter(function (method, url, async, username, password) {
                    // Don't fake POST requests
                    if (method == "POST") {
                            return true;
                    }
            });
            this.server.respondWith(function (xhr) {
                        console.log(xhr.method, xhr.url, xhr.requestBody);
            });
            this.server.respondWith(/product/,
                                    [200, {"Content-Type": "application/json"},
                                    '{"id":123,"title":"Hollywood - Part 2"}']);
            var cb = sinon.spy();
            var cb2 = sinon.spy();
            getProduct('123',cb,cb2);
            this.server.respond();
            getProduct("1234",cb,cb2);
            this.server.respond();
            expect(cb.called).toBeTruthy();
            expect(cb.getCall(0).args[1]).toEqual('success');
            expect(JSON.parse(cb.getCall(0).args[2]['responseText']))
            .toEqual({
                    id: 123,
                    title: "Hollywood - Part 2"
            });
    });

});