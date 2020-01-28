/**
 * This class implements the observable class. This makes mvc possible.
 */
class Observable {
    constructor(){
        this._subscribers = [];
    }

    /**
     * Go trough the list of subscribers and update those.
     */
    updateSubscribers(){
        this._subscribers.map(subscriber => subscriber.update());
    }

    /**
     * Allow class to subscribe to this class
     * @param subscriber
     */
    subscribe(subscriber){
        this._subscribers.push(subscriber);
    }

    /**
     * Unsubscribe the class from this observable
     * @param subscriber
     */
    unsubscribe(subscriber){
        this._subscribers.filter(subscriberList  => {
            return subscriberList !== subscriber;
        });
    }
}

export default Observable;