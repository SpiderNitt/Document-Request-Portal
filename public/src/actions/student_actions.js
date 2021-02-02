import spider from "../utils/API";
import { setDocId } from "./cert_upload.js";

// Function to get certificate types
export function getCertTypes() {
    spider
        .get("/api/student/certificate_types")
        .then((res) => {
            let docArr = [];
            res.data.forEach((add) => {
                docArr.push(add);
            });
            setDocId(docArr);
        })
        .catch((err) => {});
}