'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.smart_elections.transaction.votar} votar
 * @transaction
 */
function vote(tx) {
    if(!tx.ifVoted.checkIfVoted){
        tx.candidato.qtdVotos = tx.candidato.qtdVotos + 1;
        return getAssetRegistry('org.smart_elections.assets.candidato')
            .then(function (assetRegistry){
                return assetRegistry.update(tx.candidato);
            })
            .then(function (){
                return getAssetRegistry('org.smart_elections.assets.ifVoted')
                    .then(function (assetRegistry){
                        tx.ifVoted.checkIfVoted = true;
                        return assetRegistry.update(tx.ifVoted);
                    }) 
            })
    }
}
/**
 * Sample transaction processor function.
 * @param {org.smart_elections.transaction.SetIfVoted} tx
 * @transaction
 */
function setIfVoted(tx){
    
    var NS = 'org.smart_elections.assets';
    var factory = getFactory();
    var ifVoted = factory.newResource(NS, 'ifVoted', tx.hash);
    return getAssetRegistry(NS + '.ifVoted')
    .then(function(ifVotedtRegistry) {
        return ifVotedRegistry.addAll([ifVoted]);
    });
}
/**
 * Sample transaction processor function.
 * @param {org.smart_elections.transaction.AddEleitor} tx 
 * @transaction
 */
function addEleitor(tx){

    var NS = 'org.smart_elections.participants';
    var NSEvent = 'org.smart_elections.events';
    var factory = getFactory();
    var eleitor = factory.newResource(NS , 'Eleitor', tx.cpf);
    eleitor.nome = tx.nome;
    eleitor.tituloEleitoral = tx.tituloEleitoral;
    return getParticipantRegistry(NS + '.Eleitor')
    .then(function(participantRegistry){
        return participantRegistry.addAll([eleitor]);
    })
    .then(function(){
        var event = factory.newEvent(NSEvent, 'addIfVoted');
        event.eleitor = eleitor;
        emit(event);
    })
}
/**
 * Sample transaction processor function.
 * @param {org.smart_elections.transaction.SetCandidato} tx 
 * @transaction
 */
function SetCandidato(tx){

    var NS = 'org.smart_elections.assets';
    var factory = getFactory();
    var candidato = factory.newResource(NS , 'Candidato', tx.partido);
    candidato.nome = tx.nome;
    candidato.cpf = tx.cpf;
    return getAssetRegistry(NS + '.Candidato')
    .then(function(candidatoRedistry){
        return candidatoRedistry.addAll([candidato]);
    })
}