import { Camera, CameraResultType } from "@capacitor/camera"
import { Capacitor } from "@capacitor/core"
import { LocalNotifications } from "@capacitor/local-notifications"
import { Share } from "@capacitor/share"
import { useState } from "react"
import "./App.css"

function App() {
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [result, setResult] = useState<number | undefined>()
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<string>()

  const handleCaculate = async () => {
    setLoading(true)
    const bmi = (weight * 100) / height

    await LocalNotifications.requestPermissions()
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Kết quả tính BMI",
          body: `BMI của bạn là ${bmi}.`,
        },
      ],
    })
    setResult(bmi)
    setLoading(false)
    if (bmi < 16) {
      setValue("Gầy  độ III")
    } else if (bmi < 17) {
      setValue("Gầy độ II")
    } else if (bmi < 18.5) {
      setValue("Gầy độ I")
    } else if (bmi < 25) {
      setValue("Bình thường")
    } else if (bmi < 30) {
      setValue("Thừa cân")
    } else if (bmi < 35) {
      setValue("Béo phì độ I")
    } else if (bmi < 40) {
      setValue("Béo phì độ II")
    } else {
      setValue("Béo phì độ III")
    }
  }

  const handleShare = async () => {
    await Share.share({
      title: "Your BMI",
      text: `Your BMI is: ${result}`,
      dialogTitle: "Share your BMI",
    })
  }

  const takePhoto = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
        })
        setPhoto(image.webPath)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("Camera API in only available")
    }
  }

  return (
    <div className='container'>
      {loading && (
        <div className='overlay'>
          <span className='loader'></span>
        </div>
      )}
      <h1>BMI Application</h1>
      <div className='input-box'>
        <label htmlFor='height'>Height:</label>
        <input
          type='number'
          placeholder='Enter your height (cm)'
          className='input'
          id='height'
          value={height}
          onChange={(e) => setHeight(e.target.valueAsNumber)}
        />
      </div>
      <div className='input-box'>
        <label htmlFor='weight'>Weight:</label>
        <input
          type='number'
          placeholder='Enter your weight'
          className='input'
          id='weight'
          value={weight}
          onChange={(e) => setWeight(e.target.valueAsNumber)}
        />
      </div>
      {result && <p className='age-label'>Your BMI is: {result}</p>}
      {value && <p className='age-label'>The appriciation is: {value}</p>}
      <div>
        <button className='cal-btn' onClick={handleCaculate}>
          Caculate
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={handleShare}>Share your BMI</button>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={takePhoto}>Take photo</button>
      </div>
      {photo && (
        <div>
          <h3>Ảnh của bạn:</h3>
          <img
            src={photo}
            alt='Chụp ảnh'
            style={{ width: "100%", maxWidth: "300px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  )
}

export default App
