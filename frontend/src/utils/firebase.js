
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkgBCp3ZvQtQa7se3oDzKna9yVV7SNyN8",
  authDomain: "blog-9247c.firebaseapp.com",
  projectId: "blog-9247c",
  storageBucket: "blog-9247c.firebasestorage.app",
  messagingSenderId: "802175021315",
  appId: "1:802175021315:web:5984119613423e91153936",
  measurementId: "G-XZPLYEQC89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadFileAsync = async(folder, files, formatName, maxFilesSize) => {
    return new Promise((resolve, reject) => {
        if(files.size > maxFilesSize * 1024 * 1024){
            reject (
                new Error(`File size esceeds the maximum allowed(${maxFilesSize}MB)`)
            )
            return;
        }
        const storageRef = ref(storage, `/${folder+formatName}`)
        const uploadTask = uploadBytesResumable(storageRef, files)

        uploadTask.on(
            'state_changed', (snapshot)=>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                switch (snapshot.state){
                    case "paused":
                        console.log("Upload is paused")
                        break;
                    case "running":
                        console.log("Upload is running")
                        break;
                    default:
                        console.log("Upload state: ", snapshot.state)
                        break;
                }
            },
            (err) => {
                console.log(err);
                reject(err);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    resolve(url)
                });
            }
        )

    })
}

const firebase = {
    uploadFileAsync
}
export default firebase;