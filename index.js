let express = require('express');
let env = require('node-env-file');
let app = express();
let RiotApi = require('./TeemoJS/src/index');
env('.env');
app.use(express.json());

RiotApi = RiotApi(process.env.RIOT_API_KEY);

let tournamentProvider = async function(body) {
    try {
        let response = await RiotApi.req('na', 'tournament.stubV4.registerProviderData', {}, {}, body);
        return {
            providerId: response
        };
    } catch (err) {
        console.error(err.response);
    }
}

let tournament = async function(body) {
    try {
        let response = await RiotApi.req('americas', 'tournament.stubV4.registerTournament', {}, {}, body);
        return {
            tournamentId: response
        };
    } catch (err) {
        console.error(err.response);
    }
}

let tournamentCodes = async function(body) {
    try {
        let count  = body.count;
        let tournamentId = body.tournamentId;
        delete body.count; delete body.tournamentId;
        let response = await RiotApi.req('americas', 'tournament.stubV4.createTournamentCode', {}, {count: count, tournamentId: tournamentId}, body);
        return {
            tournamentId: response
        };
    } catch (err) {
        console.error(err.response.body);
    }
}

app.post('/tournament-provider', async function(req, res){
    tournamentProvider(req.body)
        .then(result => res.json(result))
        .catch(err => console.error(err));
});

app.post('/tournament', async function(req, res){
    tournament(req.body)
        .then(result => res.json(result))
        .catch(err => console.error(err));
});

app.post('/tournament-codes', async function(req, res){
    console.log(req);
    tournamentCodes(req.body)
        .then(result => res.json(result))
        .catch(err => console.error(err));
});

app.listen(3000);