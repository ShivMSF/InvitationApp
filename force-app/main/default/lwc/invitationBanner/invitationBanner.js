import { LightningElement,wire } from 'lwc';
import getInvitationDetailsById from '@salesforce/apex/InvitationController.getInvitationDetailsById';
import marriageInvitationAssets from '@salesforce/resourceUrl/marriageInvitationAssets';
import CONFETTI from '@salesforce/resourceUrl/confetti';
import { loadScript } from 'lightning/platformResourceLoader';


export default class InvitationBanner extends LightningElement {
    theme = 'theme1';
    recordId = 'a00IR00001uLye3YAC';
    invitationDetails = {};

    facebookUrl = '';
    twitterUrl = '';
    instagramUrl = '';

    intervalId;

    isConfettiLoaded = false;

    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;

    instagramImage = marriageInvitationAssets + '/instagram.svg';
    twitterImage = marriageInvitationAssets + '/twitter.svg';
    facebookImage = marriageInvitationAssets + '/facebook.svg';



    get bannerImage() {
        let themeName = marriageInvitationAssets + `/${this.theme}.jpeg`;
        return `background-image:url(${themeName})`;
    }

    @wire(getInvitationDetailsById, {Id:'$recordId'})
    invitationDetailsHandler({data, error}) {
        if(data) {
            this.invitationDetails = data;
            this.theme = data.Theme__c;
            this.facebookUrl = data.Facebook_Url__c;
            this.twitterUrl = data.Twitter_Url__c;
            this.instagramUrl = data.Instagram_Url__c;
            this.countdownTimer(data.Event_Date_and_Time__c);
            console.log('invitationDetailsHandler', JSON.stringify(data));
        }
        else {
            console.error(error);
        }
    }

    countdownTimer(targetDate) {
        this.intervalId = setInterval(() => {
            const currentTime = new Date().getTime();
            const targetTime = new Date(targetDate).getTime();

            //calculate the time difference
            const timeDifference = targetTime - currentTime;

            this.days = Math.floor(timeDifference / (1000*24*60*60));
            this.hours = Math.floor((timeDifference % (1000*24*60*60)) / (1000*60*60));
            this.minutes = Math.floor((timeDifference % (1000*60*60)) / (1000*60));
            this.seconds = Math.floor((timeDifference % (1000*60)) / (1000));
            if(timeDifference <= 0) {
                clearInterval(this.intervalId);
            }    

        }, 1000);

            
    }

    renderedCallback(){
        if(!this.isConfettiLoaded){
            loadScript(this, CONFETTI).then(()=>{ 
                this.isConfettiLoaded = true
                const jsConfetti = new JSConfetti();
                jsConfetti.addConfetti()
            }).catch(error=>{
                console.error("Error loading CONFETTI", error)
            })
        }
    }
}