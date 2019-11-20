import { Component, OnInit } from '@angular/core';
import { FormGroup } from  '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
    selector: 'load-excel',
    templateUrl: 'load-excel.component.html',
    styleUrls: ['load-excel.scss']
})

export class LoadExcelComponent implements OnInit {
    constructor() { }

    arrayBuffer:any;
    file:File;
    workSheet: any;
    espJSON = {};
    porJSON = {}


    ngOnInit() {}

    onFileChange(event) {
        console.log(event.target.files[0]);
        this.file = event.target.files[0];
        this.uploadFile();
    }

    uploadFile() {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            //console.log(XLSX.utils.sheet_to_json(worksheet));
            this.workSheet = XLSX.utils.sheet_to_json(worksheet);
        }
        fileReader.readAsArrayBuffer(this.file);
    }

    createJSON() {
        if (this.workSheet != undefined){
            let espJSON = {};
            let porJSON = {};
            this.workSheet.forEach(
                (element) => {
                    if (element.PROPERTIES != undefined) {
                        if (element.PROPERTIES.includes('.')==true) {
                            console.log(element.PROPERTIES.split('.'));
                            let properties = element.PROPERTIES.split('.');
                            let propertyPath = '';
                            properties.forEach(
                                (property, index) => {
                                    if (index == 0) {
                                        if (espJSON.hasOwnProperty(property) == false) {
                                            espJSON[property] = {};
                                            porJSON[property] = {};
                                        }
                                        propertyPath += '["' + property + '"]';
                                    } else {
                                        //console.log(espJSON + eval('propertyPath'));
                                        let pathEval = eval('"espJSON"+propertyPath+".hasOwnProperty(`"+property+"`)"');
                                        if (eval(pathEval) == false) {
                                            propertyPath += '["' + property + '"]';
                                            let valueESP = eval('"espJSON"+propertyPath + "= {}"');
                                            let valuePOR = eval('"porJSON"+propertyPath + "= {}"');
                                            eval(valueESP);
                                            eval(valuePOR);
                                        } else {
                                            propertyPath += '["' + property + '"]';
                                        }
                                    }
                                    
                            });
                            let valueESP
                            let valuePOR
                            if (element.ESPAÑOL != undefined) {
                                valueESP = eval('"espJSON"+propertyPath + "=`"+element.ESPAÑOL+"`"');
                            } else {
                                valueESP = eval('"espJSON"+propertyPath + "= `Falta Texto en Español`"');
                            }

                            if (element.PORTUGUÉS != undefined) {
                                valuePOR = eval('"porJSON"+propertyPath + "=`"+element.PORTUGUÉS+"`"');
                            } else {
                                valuePOR = eval('"porJSON"+propertyPath + "= `Falta Texto en Portugues`"');
                            }
                            eval(valueESP);
                            eval(valuePOR);

                        }
                        
                    }
                    
            })
            console.log(espJSON);
            this.espJSON = espJSON;
            console.log(this.espJSON);
            this.porJSON = porJSON;
        } else{
            
        }
    }

}