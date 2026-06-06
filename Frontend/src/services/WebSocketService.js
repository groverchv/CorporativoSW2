import { supabase } from '../api/supabase';

class WebSocketService {
    constructor() {
        this.channel = null;
        this.connected = false;
        this.callbacks = new Map();
        this.presenceState = {};
    }

    connect(username, location, onConnected, onError) {
        try {
            console.log('Conectando presencia en tiempo real con Supabase...');
            
            // Limpiar canal anterior si existe
            if (this.channel) {
                this.channel.unsubscribe();
            }

            // Crear un canal de Supabase
            const safeKey = username || 'anonymous_' + Math.random().toString(36).substring(2, 11);
            this.channel = supabase.channel('online-users', {
                config: {
                    presence: {
                        key: safeKey,
                    },
                },
            });

            this.channel
                .on('presence', { event: 'sync' }, () => {
                    this.presenceState = this.channel.presenceState();
                    const counts = this.getCounts();
                    this.triggerCallbacks('/topic/users-count', counts);
                })
                .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                    console.log('Usuario se unió:', key, newPresences);
                })
                .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                    console.log('Usuario se desconectó:', key, leftPresences);
                });

            this.channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    this.connected = true;
                    console.log('Suscrito a Supabase Realtime!');
                    
                    // Rastrear el estado de presencia
                    await this.channel.track({
                        location: location || 'other',
                        online_at: new Date().toISOString(),
                    });
                    
                    if (onConnected) {
                        onConnected();
                    }
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Error al suscribirse al canal de tiempo real');
                    if (onError) {
                        onError(new Error("Error en canal de presencia"));
                    }
                }
            });
        } catch (error) {
            console.error('Error en conexión de presencia:', error);
            if (onError) {
                onError(error);
            }
        }
    }

    getCounts() {
        let total = 0;
        let dashboard = 0;
        let otherPages = 0;

        Object.keys(this.presenceState).forEach(key => {
            const presences = this.presenceState[key] || [];
            presences.forEach(presence => {
                total++;
                if (presence.location === 'dashboard') {
                    dashboard++;
                } else {
                    otherPages++;
                }
            });
        });

        return {
            total,
            dashboard,
            otherPages
        };
    }

    disconnect() {
        if (this.channel) {
            this.channel.unsubscribe();
            this.channel = null;
        }
        this.connected = false;
        this.callbacks.clear();
        console.log('Presencia de Supabase desconectada');
    }

    subscribe(topic, callback) {
        if (!this.callbacks.has(topic)) {
            this.callbacks.set(topic, []);
        }
        this.callbacks.get(topic).push(callback);

        if (topic === '/topic/users-count') {
            // Mandar conteo actual
            callback(this.getCounts());
        }

        return {
            unsubscribe: () => this.unsubscribe(topic, callback)
        };
    }

    unsubscribe(topic, callback) {
        const list = this.callbacks.get(topic);
        if (list) {
            this.callbacks.set(topic, list.filter(cb => cb !== callback));
        }
    }

    triggerCallbacks(topic, data) {
        const list = this.callbacks.get(topic);
        if (list) {
            list.forEach(cb => {
                try {
                    cb(data);
                } catch (e) {
                    console.error('Error ejecutando callback de websocket:', e);
                }
            });
        }
    }

    async updateLocation(location) {
        if (this.channel && this.connected) {
            try {
                await this.channel.track({
                    location: location || 'other',
                    online_at: new Date().toISOString(),
                });
                console.log('Presencia actualizada a ubicación:', location);
            } catch (error) {
                console.error('Error al actualizar presencia:', error);
            }
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new WebSocketService();
