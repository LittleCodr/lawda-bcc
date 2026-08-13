const { getFirestore, doc, setDoc } = require("firebase/firestore");
// we can't easily test without init, but it's a known Firestore fact that undefined throws.
