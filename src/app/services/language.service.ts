import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlConfig } from '../module/config';

const domainId = 'REALCONDITION_WEBCLI';
@Injectable({
    providedIn: 'root'
})

export class LanguageService {

    constructor(private http: HttpClient) {
    }

    private get(locale: string) {
        let url = UrlConfig.baseUrlRealHelpWebApi_Original + `translate/gettranslationsbydomain/REALCONDITION_WEBCLI/${locale}/-1`; //+ '?sessionid={AB2E286B-30DB-4627-B99D-09F8BA5100A6}';
        return this.http.get(url);
    }

    async translate(attribute: string, translationkey: string, clientId: number = -1): Promise<string> {
        let locale = JSON.parse(localStorage.getItem('RCAPOPTIONS'));
        if (locale === null) {
            await this.getRCAPOptions();
            locale = JSON.parse(localStorage.getItem('RCAPOPTIONS'));
        }
        let lang = locale.Language;
        return new Promise<string>((resolve, reject) => {
            this.get(lang).subscribe((translations: any[]) => {
                if (translations) {
                    const key = `${lang}.${attribute}.${translationkey}.${clientId}`;
                    const translation = translations.find(t => t.TranslationKey === key);

                    if (translation) {
                        console.log('LangugaeService: ' + key + ' , Value: ' + translation.TranslationValue)
                        resolve(translation.TranslationValue);
                    }
                    else resolve(translationkey);
                }
                else reject();
            })
        });
    }

    private async getRCAPOptions() {
        const url = UrlConfig.baseUrlRealCondition_Original + 'api/rcapoptions';
        return new Promise((resolve, reject) => {
            this.http.get(url)
                .subscribe((data: any) => {
                    console.log(data);
                    localStorage.setItem('RCAPOPTIONS', JSON.stringify(data));
                    resolve(true)
                }, (error) => { console.log("Error getting Approval Portal options"); reject(error) });
        })
    }
}
