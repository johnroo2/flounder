import { CloseOutlined } from "@ant-design/icons";
import { Upload, notification } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";

interface props{
    render: JSX.Element,
    onSubmit:(formData:FormData) => any,
    className?: string,
    formSettings?:{fieldName:string},
}

export default function FullUpload({render, onSubmit, className, formSettings={fieldName:"image"}}:props){
    const handleImageChange = async(image:string) => {
        try{
            const byteCharacters = atob(image.split(',')[1]);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append(formSettings.fieldName, blob, 'image.jpg');
            onSubmit(formData)
        }
        catch(err){
            console.log(err);
        }
    }
    
    const uploadprops: UploadProps = {
        beforeUpload: (file) => {
            const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
            const isAllowed = allowed.findIndex((item:any)=>file.type===item) > -1
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                notification.open({
                    message: "Upload failed",
                    description: `Your file is too large! Your image: 
                    ${(file.size / (1024*1024)).toFixed(2)}MB. (Upload Limit: 5MB)`,
                    icon: <CloseOutlined style={{color: '#ff0303',}}/>
                })
                return false;
            }
            if (!isAllowed) {
                notification.open({
                    message: "Upload failed",
                    description: `${file.name} of type ${file.type} is not supported. Supported image types are
                    png, jpg, jpeg, gif.`,
                    icon: <CloseOutlined style={{color: '#ff0303',}}/>
                })
            }
            return isAllowed || Upload.LIST_IGNORE;
        },
        onChange: (info: any) => {
            try{
                const file: RcFile = info?.fileList[0]?.originFileObj;
                if(info?.file?.error){
                    notification.open({
                        message: "Upload failed",
                        description: `Internal Server Error.`,
                        icon: <CloseOutlined style={{color: '#ff0303',}}/>
                    })
                }
        
                if (info?.fileList[0]?.status === "done") {
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const imageDataUrl = reader.result as string;
                            handleImageChange(imageDataUrl);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        },
        maxCount:1,
        showUploadList:false,
        className:className
    };

    return(
        <Upload {...uploadprops}>
            {render}
        </Upload>
    )
}