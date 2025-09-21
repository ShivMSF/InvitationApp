public without sharing class InvitationController {
    
    //Get Invitation details by Id
    @AuraEnabled(cacheable=true)
    public static Invitation__c getInvitationDetailsById(String Id){
        try{
            return [SELECT Id, Twitter_Url__c, Theme__c, Instagram_Url__c, Greeting_Message__c, Facebook_Url__c, Event_Participants__c,
            Event_Introduction__c, Event_Date_and_Time__c from Invitation__c where Id= : Id];
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Get program Details By Invitation Id
    @AuraEnabled(cacheable=true)
    public static List<Program_Detail__c> getProgramDetailsByInvitationId(String Id) {
        try{
            return [SELECT Id, Name, Program_Date__c, Program_Start_Time__c, Program_End_Time__c from Program_Detail__c 
            where Invitation__c = :Id];
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Get Invitation Address by Id
    @AuraEnabled(cacheable=true)
    public static Invitation__c getInvitationAddress(String Id){
        try{
            return [SELECT Id, Event_Address__c, Event_Map_URL__c, Contact_Number__c from Invitation__c where Id= : Id];
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Invitation__c getRSVPDetails(String Id){
        try {
            return [SELECT Id, Rsvp_Accept_Message__c, Rsvp_after_date_Message__c, Rsvp_Decline_Message__c , Respond_By__c from Invitation__c where Id= : Id];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // //Submit Invitation Response
    // public static Boolean submitResponse(Id invitationId, String name, String email) {

    // }

    // Added a comment
}