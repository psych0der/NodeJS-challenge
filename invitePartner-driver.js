const {getInviteCandidates} = require('./invitePartner');
const CustomError = require('./CustomError');
/* Fetch invitees for meal party! */
try {
    const mealInvitees = getInviteCandidates('./partners.json');
    /* print details */
    console.group("Invitees")
    mealInvitees.forEach(invitee => {
        console.group('===>')
        console.log('Company name: ' + invitee.companyName)
        console.log('Company address: ' + invitee.address);
        console.groupEnd();
    });
    console.groupEnd();
} catch (err) {
    if (err instanceof CustomError) {
        console.error("Error: " + err.message);
        console.error("ERR_CODE: " + err.code);
    } else {
        throw err
    }
}
