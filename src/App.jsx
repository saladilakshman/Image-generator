import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Container,
  Stack, 
  CircularProgress, 
  Typography,
  Box, 
  useTheme, 
  useMediaQuery, 
} from "@mui/material";
import { useGetImageMutation } from "./ApiServices/apiservices";
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import "./App.css";
import Error from "./assets/error.png";
function App() {

  const theme = useTheme();
  const Mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const [val, setVal] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isFulfilled, setIsFulfilled] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [img, setImg] = useState("");
  const [generateImage, result] = useGetImageMutation(); // Align name with mutation function
  console.log(result)
  const handleGenerate = () => {
    if (val === "") {
      window.alert('please enter text')
    }
    else {
      generateImage(val);

    }

  };


  useEffect(() => {
    if (result.isLoading) {
      setIsPending(true);
      setIsFulfilled(false);
      setIsRejected(false);
    } if (result.isError) {
      setIsPending(false);
      setIsFulfilled(false);
      setIsRejected(true);
      setVal("")
    } if (result.isSuccess) {
      setIsPending(false);
      setIsFulfilled(true);
      setIsRejected(false);
      setImg(result.data.generated_image);
      setVal("") // Assuming the data contains the image URL
    }
  }, [result]);

  /**share image generated by AI */
  const shareImage = async () => {
    await axios.get(img,{responseType:'blob'})
      .then(res => {
        const file = new File([res.data], 'Ai.png', { type: res.data.type });
        const data = {
          files: [file],
          text: 'Ai-genereated image'
        }
        if (navigator.share && navigator.canShare(data)) {
          try {
            navigator.share(data)
          }
          catch (err) {
            console.log(err)
          }
        }
        else {
          console.log('web share not supported')
        }
      })
      .catch(err => console.log(err.message))
  }

  /**download image generated by AI */
  const downloadImage = async () => {
    await axios.get(img,{responseType:'blob'})
      .then(res => {
        const url = URL.createObjectURL(res.data);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "AI.png";
        document.body.appendChild(anchor);
        anchor.click();
      })
      .catch(err => console.log(err.message))
  }

  return (
    <>
      <Typography variant="h3" textAlign="center" sx={{
        background: 'linear-gradient(122deg,#ff7f00,#6f42c1)',
        color: 'transparent',
        backgroundClip: 'text'
      }}>AI Image Generator</Typography>
      <Container>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80svh'
        }}>
          {isPending && <Stack direction="column" justifyContent="center" alignItems="center" spacing={1.2}>
            <CircularProgress color="info" />
            <Typography variant="h6">Generating.Please wait...</Typography>
          </Stack>}

          {isRejected
            &&
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={1.2}>
              <Box component="img" src={Error} alt=""
                sx={{
                  width: { xs: 50, sm: 60, lg: 80 }
                }} />
              <Typography variant="h6">Oops! something went wrong</Typography>
            </Stack>
          }

          {isFulfilled && <>
            <Box component="img" src={img} alt="" sx={{
              width: { xs: 320, sm: 500, lg: 700 },
              height: { xs: 320, sm: 500, lg: 500 },
            }} />
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.2} sx={{
              marginBlockStart: 2
            }}>
              <Button variant="outlined" size="small" endIcon={
                <ShareIcon />
              } sx={{
                borderColor: 'black',
                color: 'black',
                "&:hover,&:focus": {
                  borderColor: 'black',
                  color: 'black',
                }
              }}
                onClick={shareImage}
              >Share Img</Button>
              <Button variant="contained" size="small" endIcon={
                <DownloadIcon />
              } sx={{
                backgroundColor: '#7c4a91',
                '&:hover,&:active': {
                  backgroundColor: '#7c4a91'
                }
              }}
                onClick={downloadImage}
              >Downlaod Img</Button>
            </Stack>
          </>}
        </Box>



        <Box sx={{
          position: 'absolute',
          bottom: 5,
          left: 5,
          right: 5,

        }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <TextField
              label="Search"
              value={val}
              onChange={(e) => {
                setVal(e.target.value)
              }}
              placeholder="Enter your text to generate Image"
              spellCheck={true}
              multiline
              maxRows={3}
              fullWidth
              size="small"
            />
            <Button variant="contained" size={Mobile ? 'small' : "medium"}
              onClick={handleGenerate}>{Mobile ? <SendIcon /> : 'Generate'}</Button>
          </Stack>
        </Box>

      </Container>
    </>
  );
}

export default App;