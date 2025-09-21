import { LightningElement,wire } from 'lwc';
import getInvitationAddress from '@salesforce/apex/InvitationController.getInvitationAddress';

export default class InvitationAddress extends LightningElement {
    recordId = 'a00IR00001uLye3YAC';
    addressDetails={};
    @wire(getInvitationAddress, {Id: '$recordId'})
        addressHandler({data, error}) {
            if(data){
                console.log("addressHandler data", JSON.stringify(data))
                this.addressDetails = data
            }
            if(error){
                console.error("addressHandler Error",error)
            }
        }
}