
import axios from "axios";
import * as globals from "../../common/globals";


export default class RestApi {
    instance=null;

    constructor() {
        this.instance = axios.create({
            baseURL: globals.BASE_URL,
            timeout: 50000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

    }

    static getInstance(){
        if(this.instance== null){
            this.instance = axios.create({
                baseURL: globals.BASE_URL,
                timeout: 50000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
        return this.instance;
    }
    //
    // static getInstance2(token){
    //     if(this.instance== null){
    //         this.instance = axios.create({
    //             baseURL: 'http://161.35.95.54/api/',
    //             timeout: 50000,
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization':'Bearer '+ token,
    //             }
    //         });
    //     }
    //     return this.instance;
    // }

};
