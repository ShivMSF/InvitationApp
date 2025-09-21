import { LightningElement,wire } from 'lwc';
import getProgramDetailsByInvitationId from '@salesforce/apex/InvitationController.getProgramDetailsByInvitationId';

export default class InvitationProgramDetails extends LightningElement {
    recordId = 'a00IR00001uLye3YAC';
    programList=[];
    @wire (getProgramDetailsByInvitationId, {Id: '$recordId'})
    programDetailsHandler({data, error}) {
        if(data){
            console.log("ProgramList", data)
            this.programList = data
        }
        if(error){
            console.log("Error in programDetailsHandler",error)
        }
    }
}