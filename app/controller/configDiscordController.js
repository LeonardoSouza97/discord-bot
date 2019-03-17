const Model = require('../models/index');

module.exports = class configDiscordController {

    constructor(id, token, client_id) {
        this.id = id;
        this.token = token;
        this.client_id = client_id;
    }

    async getById(id) {
        var configDiscord = new configDiscordController();

        await Model.Config.findByPk(id)
            .then(config => {
                configDiscord.id = config.id;
                configDiscord.token = config.token;
                configDiscord.client_id = config.client_id;
               
            });
            return configDiscord;
    }
}

