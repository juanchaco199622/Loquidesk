import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyAMXZfa6XJbkuNteRwmfV1Cn99ar474ZXQ",
  authDomain: "loquidesk.firebaseapp.com",
  databaseURL: "https://loquidesk.firebaseio.com",
  projectId: "loquidesk",
  storageBucket: "loquidesk.appspot.com",
  messagingSenderId: "501237485476",
  appId: "1:501237485476:web:d695a52314103641fffb31",
  measurementId: "G-476HGV8QHJ"
  };
// VALIDADO
class Firebase {
    constructor (){
        app.initializeApp(config);
        this.db = app.firestore();
        this.auth = app.auth(); //VALIDADO
        this.storage = app.storage();

        this.storage.ref().constructor.prototype.guardarDocumento = function(documentos){
            var ref=this;
            return Promise.all(documentos.map(function(file){
                return ref.child(file.alias).put(file).then(snapshot =>{
                    return ref.child(file.alias).getDownloadURL();
                })
            }))
        }
    }

    estaIniciado(){
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }// VALIDADO

    guardarDocumentos = (nombreDocumento, documento) => this.storage.ref().child(nombreDocumento).put(documento);

    devolverDocumento = (documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();
    
    guardarDocumento = (documentos) => this.storage.ref().guardarDocumento(documentos);

    eliminarDocumento = documento => this.storage.ref().child(documento).delete();

}

export default Firebase;
// NOTA: YA valide que esta bien 