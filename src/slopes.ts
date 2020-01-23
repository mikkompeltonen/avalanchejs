/**
 * @module AVACore
 */
import { API, RequestResponseData } from './utils/types';
import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse, Method} from "axios";

/**
 * AVACore is middleware for interacting with AVA node RPC APIs. 
 * 
 * Example usage:
 * ```js
 * let ava = new AVACore("127.0.0.1", 9650, "https");
 * ```
 * 
 */
export default class AVACore {
    protected protocol:string;
    protected ip:string;
    protected port:number;
    protected url:string;
    protected apis:{ [k: string]: API } = {};

    /**
     * Sets the address and port of the main AVA Client.
     * 
     * @param ip The hostname to resolve to reach the AVA Client RPC APIs
     * @param port The port to reolve to reach the AVA Client RPC APIs
     * @param protocol The protocol string to use before a "://" in a request, ex: "http", "https", "git", "ws", etc ...
     */
    setAddress = (ip:string, port:number, protocol:string = "http") => {
            this.ip = ip;
            this.port = port;
            this.protocol = protocol;
            this.url = protocol+'://'+ip+':'+port;
    }

    /**
     * Returns the protocol such as "http", "https", "git", "ws", etc.
     */
    getProtocol = ():string => {
        return this.protocol;
    }

    /**
     * Returns the IP for the AVA node.
     */
    getIP = ():string => {
        return this.ip;
    }

    /**
     * Returns the port for the AVA node.
     */
    getPort = ():number => {
        return this.port;
    }

    /**
     * Returns the URL of the AVA node (ip + port);
     */
    getURL = ():string => {
        return this.url;
    }

    /**
     * Adds an API to the middleware. The API resolves to a registered subnet's RPC. 
     * 
     * In TypeScript:
     * ```typescript
     * ava.addAPI<MyVMClass>("mysubnet", "/ext/mysubnet", MyVMClass);
     * ```
     * 
     * In Javascript:
     * ```js
     * ava.addAPI("mysubnet", "/ext/mysubnet", MyVMClass);
     * ```
     * 
     * @typeparam GA Class of the API being added
     * @param apiName A label for referencing the API in the future
     * @param baseurl Path to resolve to reach the API
     * @param constructorFN A reference to the class which instantiates the API
     * 
     */
    addAPI = <GA extends API>(apiName:string, constructorFN: new(ava:AVACore, baseurl?:string) => GA, baseurl:string = undefined,) => {
        if(baseurl == undefined) {
            this.apis[apiName] = new constructorFN(this);
        } else {
            this.apis[apiName] = new constructorFN(this, baseurl);
        }
    }

    /**
     * Retrieves a reference to an API by its apiName label.
     * 
     * @param apiName Name of the API to return
     */
    api = <GA extends API>(apiName:string): GA => {
        return this.apis[apiName] as GA;
    }

    /**
     * @ignore
     */
    protected _request = async (xhrmethod:Method, baseurl:string, getdata:object, postdata:string | object | ArrayBuffer | ArrayBufferView, headers:object = {}, axiosConfig:AxiosRequestConfig = undefined): Promise<RequestResponseData> => {

        let config:AxiosRequestConfig;
        if(axiosConfig){
            config = axiosConfig;
        } else {
            config = {
                baseURL:this.protocol+"://"+this.ip+":"+this.port,
                responseType: 'text'
            };
        }
        config.url = baseurl;
        config.method = xhrmethod;
        config.headers = headers;
        config.data = postdata;
        config.params = getdata;
        return axios.request(config).then((resp:AxiosResponse<any>) => {
            //purging all that is axios
            let xhrdata:RequestResponseData = new RequestResponseData();
            xhrdata.data = resp.data;
            xhrdata.headers = resp.headers;
            xhrdata.request = resp.request;
            xhrdata.status = resp.status;
            xhrdata.statusText = resp.statusText;
            return xhrdata;
        });
    }

    /**
     * Makes a GET call to an API.
     * 
     * @param baseurl Path to the api
     * @param getdata Object containing the key value pairs sent in GET
     * @param parameters Object containing the parameters of the API call
     * @param headers An array HTTP Request Headers
     * @param axiosConfig Configuration for the axios javascript library that will be the foundation for the rest of the parameters
     * 
     * @returns A promise for [[RequestResponseData]]
     */
    get = (baseurl:string, getdata:object, headers:object = {}, axiosConfig:AxiosRequestConfig = undefined): Promise<RequestResponseData> =>{
        return this._request("GET", baseurl, getdata, {}, headers, axiosConfig);
    }

    /**
     * Makes a DELETE call to an API.
     * 
     * @param baseurl Path to the API
     * @param getdata Object containing the key value pairs sent in DELETE
     * @param parameters Object containing the parameters of the API call
     * @param headers An array HTTP Request Headers
     * @param axiosConfig Configuration for the axios javascript library that will be the foundation for the rest of the parameters
     * 
     * @returns A promise for [[RequestResponseData]]
     */
    delete = (baseurl:string, getdata:object, headers:object = {}, axiosConfig:AxiosRequestConfig = undefined): Promise<RequestResponseData> => {
        return this._request("DELETE", baseurl, getdata, {}, headers, axiosConfig);
    }

    /**
     * Makes a POST call to an API.
     * 
     * @param baseurl Path to the API
     * @param getdata Object containing the key value pairs sent in POST
     * @param postdata Object containing the key value pairs sent in POST
     * @param parameters Object containing the parameters of the API call
     * @param headers An array HTTP Request Headers
     * @param axiosConfig Configuration for the axios javascript library that will be the foundation for the rest of the parameters
     * 
     * @returns A promise for [[RequestResponseData]]
     */
    post = (baseurl:string, getdata:object, postdata:string | object | ArrayBuffer | ArrayBufferView, headers:object = {}, axiosConfig:AxiosRequestConfig = undefined): Promise<RequestResponseData> => {
        return this._request("POST", baseurl, getdata, postdata, headers, axiosConfig);
    }

    /**
     * Makes a PUT call to an API.
     * 
     * @param baseurl Path to the baseurl
     * @param getdata Object containing the key value pairs sent in PUT
     * @param postdata Object containing the key value pairs sent in PUT
     * @param parameters Object containing the parameters of the API call
     * @param headers An array HTTP Request Headers
     * @param axiosConfig Configuration for the axios javascript library that will be the foundation for the rest of the parameters
     * 
     * @returns A promise for [[RequestResponseData]]
     */
    put = (baseurl:string, getdata:object, postdata:string | object | ArrayBuffer | ArrayBufferView, headers:object = {}, axiosConfig:AxiosRequestConfig = undefined): Promise<RequestResponseData> => {
        return this._request("PUT", baseurl, getdata, postdata, headers, axiosConfig);
    }

    /**
     * Makes a PATCH call to an API.
     * 
     * @param baseurl Path to the baseurl
     * @param getdata Object containing the key value pairs sent in PATCH
     * @param postdata Object containing the key value pairs sent in PATCH
     * @param parameters Object containing the parameters of the API call
     * @param headers An array HTTP Request Headers
     * @param axiosConfig Configuration for the axios javascript library that will be the foundation for the rest of the parameters
     * 
     * @returns A promise for [[RequestResponseData]]
     */
    patch = (baseurl:string, getdata:object, postdata:string | object | ArrayBuffer | ArrayBufferView, headers:object = {}, axiosConfig:AxiosRequestConfig = undefined): Promise<RequestResponseData> => {
        return this._request("PATCH", baseurl, getdata, postdata, headers, axiosConfig);
    }
    
    /**
     * Creates a new AVAJS instance. Sets the address and port of the main AVA Client.
     * 
     * @param ip The hostname to resolve to reach the AVA Client APIs
     * @param port The port to reolve to reach the AVA Client APIs
     * @param protocol The protocol string to use before a "://" in a request, ex: "http", "https", "git", "ws", etc ...
     */
    constructor(ip:string, port:number, protocol:string = "http"){
        this.setAddress(ip, port, protocol);
    }
}