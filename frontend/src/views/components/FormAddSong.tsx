import React, { ChangeEvent } from "react";
import { Alert, Button, Grid, Input, Typography } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { Buffer } from 'buffer';

interface Props {
  songAddedMessage: string | null;
  handleCreate: (
    event: React.FormEvent<HTMLFormElement>,
    newSongTitle: string,
    newSongArtist: string,
    newSongAlbum: string,
    newFileB64: string
  ) => void;
}

interface State {
  newSongTitle: string;
  newSongArtist: string;
  newSongAlbum: string;
  newFileB64: string;
  songLoadedMessage: string | null;
}

export default class FormAddSong extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      newSongTitle: "",
      newSongArtist: "",
      newSongAlbum: "",
      songLoadedMessage: null,
      newFileB64: "",
    };
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.handleCreate(
      event,
      this.state.newSongTitle,
      this.state.newSongArtist,
      this.state.newSongAlbum,
      this.state.newFileB64
    );
    this.setState({
      newSongTitle: "",
      newSongArtist: "",
      newSongAlbum: "",
      songLoadedMessage: null,
      newFileB64: "",
    });
  };

  handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      let file = e.currentTarget.files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          let result = event.target.result;
          if (typeof result !== "string") {
            this.setState({
              newFileB64: Buffer.from(result).toString('base64'),
              songLoadedMessage: "File is loaded",
            });
          } else {
            // do something
          }
        }
      };
      reader.readAsArrayBuffer(file);
      this.setState({ songLoadedMessage: "Loading file.." });
    } else {
      console.log("no files");
    }
  };

  render = () => {
    return (
      <Grid item>
        <form onSubmit={this.handleSubmit}>
          <Grid
            container
            direction={"column"}
            alignItems={"center"}
            spacing={3}
          >
            <Grid item>
              <Typography variant={"h5"}>Add a song</Typography>
            </Grid>
            <Grid item xs={8}>
              <Input
                required
                onChange={(val) => {
                  this.setState({ newSongTitle: val.currentTarget.value });
                }}
                placeholder="Title"
                inputProps={{ "aria-label": "description" }}
              />
            </Grid>
            <Grid item xs={8}>
              <Input
                required
                onChange={(val) => {
                  this.setState({ newSongArtist: val.currentTarget.value });
                }}
                placeholder="Artist"
                inputProps={{ "aria-label": "description" }}
              />
            </Grid>
            <Grid item xs={8}>
              <Input
                required
                onChange={(val) => {
                  this.setState({ newSongAlbum: val.currentTarget.value });
                }}
                placeholder="Album"
                inputProps={{ "aria-label": "description" }}
              />
            </Grid>
            <Grid item xs={8}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFile />}
                sx={{ marginRight: "1rem" }}
              >
                Upload WAV
                <input
                  type="file"
                  accept=".wav"
                  hidden
                  onChange={this.handleFileUpload}
                />
              </Button>
            </Grid>
            {this.state.songLoadedMessage ? (
              <Grid item xs={8}>
                <Alert severity="info">{this.state.songLoadedMessage}</Alert>
              </Grid>
            ) : null}
            <Grid item>
              <Button type="submit" variant="contained" color="success">
                <Typography variant={"button"}>Add song</Typography>
              </Button>
              {this.props.songAddedMessage ? (
                <Grid item xs={8}>
                  <Alert severity="success">
                    {this.props.songAddedMessage}
                  </Alert>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </form>
      </Grid>
    );
  };
}
