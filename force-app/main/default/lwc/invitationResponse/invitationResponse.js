import { LightningElement, wire } from 'lwc';
import getRSVPDetails from '@salesforce/apex/InvitationController.getRSVPDetails';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import INVITATION_RESPONSE_OBJECT from "@salesforce/schema/Invitation_Response__c";
import RESPONSE_FIELD from "@salesforce/schema/Invitation_Response__c.Response__c";
import NAME_FIELD from "@salesforce/schema/Invitation_Response__c.Name__c";
import INVITATION_FIELD from "@salesforce/schema/Invitation_Response__c.Invitation__c";
import EMAIL_FIELD from "@salesforce/schema/Invitation_Response__c.Email__c";
import PHONE_FIELD from "@salesforce/schema/Invitation_Response__c.Phone__c";
import ADDITIONAL_GUESTS_FIELD from "@salesforce/schema/Invitation_Response__c.Number_of_additional_Guests__c";
import ADDITIONAL_COMMENT_FIELD from "@salesforce/schema/Invitation_Response__c.Additional_comments__c";
import {createRecord} from 'lightning/uiRecordApi';

export default class InvitationResponse extends LightningElement {
    recordId='a00IR00001uLye3YAC';
    formData={};
    rsvpDetailsInfo={};
    rsvpOptions=[];
    invitationResponseRecordTypeId;
    error;
    fields={};
    rsvpMessage;

    @wire(getObjectInfo, { objectApiName: INVITATION_RESPONSE_OBJECT })
    results({ error, data }) {
        if (data) {
        this.invitationResponseRecordTypeId = data.defaultRecordTypeId;
        this.error = undefined;
        } else if (error) {
        this.error = error;
        this.invitationResponseRecordTypeId = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: "$invitationResponseRecordTypeId", fieldApiName: RESPONSE_FIELD })
    picklistResults({ error, data }) {
        if (data) {
        this.rsvpOptions = data.values;
        this.error = undefined;
        } else if (error) {
        this.error = error;
        this.rsvpOptions = undefined;
        }
    }

    @wire(getRSVPDetails, {Id:'$recordId'})
    rsvpHandler({data,error}){
        if(data){
            this.rsvpDetailsInfo = data;
            this.checkAndSetMessage();
        } else {
            console.log('Error: ',error)
        }
    }

    changeHandler(event){
        const {name, value} = event.target;
        this.formData = {...this.formData, [name]: value}
    }

    async submitHandler(event){
        this.rsvpMessage = '';
        event.preventDefault();
        console.log('Form Data: ',JSON.stringify(this.formData));
        this.fields[RESPONSE_FIELD.fieldApiName]=this.formData.Response;
        this.fields[NAME_FIELD.fieldApiName]=this.formData.Name;
        this.fields[INVITATION_FIELD.fieldApiName]=this.recordId;
        this.fields[EMAIL_FIELD.fieldApiName]=this.formData.Email;
        this.fields[PHONE_FIELD.fieldApiName]=this.formData.Phone;
        this.fields[ADDITIONAL_GUESTS_FIELD.fieldApiName]=this.formData.additionalGuests;
        this.fields[ADDITIONAL_COMMENT_FIELD.fieldApiName]=this.formData.additionalComments;
        try {
            const result = await createRecord({apiName:INVITATION_RESPONSE_OBJECT.objectApiName,fields: this.fields})
            console.log('Result: ',result);
            localStorage.setItem(`invitationSubmitted-${this.recordId}`,this.formData.Response);
            this.checkAndSetMessage();
        } catch (error) {
            console.log('Error: ',error);
        }
    }

    checkAndSetMessage() {
        let isResponseSubmitted = '';
        let allKeys = Object.keys(window.localStorage);
        allKeys.forEach(item =>{
            if(item.endsWith(this.recordId)){
                isResponseSubmitted = localStorage[item]
            }
        })

        if(isResponseSubmitted === 'Joyfully Accept') {
            this.rsvpMessage = this.rsvpDetailsInfo.Rsvp_Accept_Message__c;
        } else if(isResponseSubmitted === 'Regretfully Decline') {
            this.rsvpMessage = this.rsvpDetailsInfo.Rsvp_Decline_Message__c;
        } else if(!isResponseSubmitted && this.isRespondByDateIsPast(this.rsvpDetailsInfo.Respond_By__c)) {
            this.rsvpMessage = this.rsvpDetailsInfo.Rsvp_after_date_Message__c;
        }        
        else {
            this.rsvpMessage = '';
        }
    }

    isRespondByDateIsPast(respondByDate){
        //Get the current date
        const today = new Date();
        const providedDate = new Date(respondByDate);
        return today > providedDate;
    }
}