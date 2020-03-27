export const obtenerData = (firebase, paginaSize, casoInicial, texto) =>{
    return new Promise(async (resolve, eject)=>{
        let casos = firebase.db
        .collection("Casos")
        .orderBy("prioridad")
        .limit(paginaSize);

        if(casoInicial !== null){
            casos = firebase.db
            .collection("Casos")
            .orderBy("prioridad")
            .startAfter(casoInicial)
            .limit(paginaSize);

            if(texto.trim() !== ""){
                casos = firebase.db
                .collection("Casos")
                .orderBy("prioridad")
                .where("keywords","array-contains", texto.toLowerCase())
                .startAfter(casoInicial)
                .limit(paginaSize)
            }
        }


        const snapshot = await casos.get();
        const arrayCasos2 = snapshot.docs.map(doc =>{
            let data = doc.data();
            let id = doc.id;
            return{id, ...data}
        })

        const inicialValor = snapshot.docs[0];
        const finalValor = snapshot.docs[snapshot.docs.length -1];

        const returnValue = {
            arrayCasos2,
            inicialValor,
            finalValor

        }
        resolve(returnValue);
    })
   
}

export const obtenerDataAnterior = (firebase, paginaSize, casoInicial, texto) =>{
    return new Promise(async (resolve, eject)=>{
        let casos = firebase.db
        .collection("Casos")
        .orderBy("prioridad")
        .limit(paginaSize);

        if(casoInicial !== null){
            casos = firebase.db
            .collection("Casos")
            .orderBy("prioridad")
            .startAt(casoInicial)
            .limit(paginaSize);

            if(texto.trim() !== ""){
                casos = firebase.db
                .collection("Casos")
                .orderBy("prioridad")
                .where("keywords","array-contains", texto.toLowerCase())
                .startAt(casoInicial)
                .limit(paginaSize)
            }
        }


        const snapshot = await casos.get();
        const arrayCasos2 = snapshot.docs.map(doc =>{
            let data = doc.data();
            let id = doc.id;
            return{id, ...data}
        })

        const inicialValor = snapshot.docs[0];
        const finalValor = snapshot.docs[snapshot.docs.length -1];

        const returnValue = {
            arrayCasos2,
            inicialValor,
            finalValor

        }
        resolve(returnValue);
    })
   
}