import React, { ChangeEvent } from "react";
import Playlist from "../../../backend/src/models/Playlist";
import Song from "../../../backend/src/models/Song";
import { ControllerSongs } from "../controllers/ControllerSongs";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Delete, MusicNote } from "@mui/icons-material";
import ViewSong from "./ViewSong";
import FormAddSong from "./components/FormAddSong";
import i18next from "../i18n";

interface Props {
  selectedPlaylist: Playlist;
  selectedPlaylistAuthor: string;
  userUuid: string;
  sessionHash: string;
}

interface State {
  songs: Song[] | null;
  selectedSongId: number | null;
  isOwner: boolean;
  songAddedMessage: string | null;
}

export default class ViewPlaylist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      songs: this.props.selectedPlaylist.songs,
      selectedSongId: null,
      isOwner:
        this.props.userUuid === this.props.selectedPlaylist.playlist_user_uuid,
      songAddedMessage: null,
    };
  }

  handleCreate = async (
    event: React.FormEvent<HTMLFormElement>,
    newSongTitle: string,
    newSongArtist: string,
    newSongAlbum: string,
    newFileB64: string
  ) => {
    event.preventDefault();
    // TODO: Song info validation
    let playlistId = this.props.selectedPlaylist.playlist_id
      ? this.props.selectedPlaylist.playlist_id
      : -1;
    let result = await ControllerSongs.addSong(
      this.props.sessionHash,
      this.props.userUuid,
      playlistId,
      newSongTitle,
      newSongArtist,
      newSongAlbum,
      newFileB64
    );
    if (result?.is_success && this.state.songs) {
      this.state.songs.push({
        song_id: result.song_id,
        song_user_uuid: this.props.userUuid,
        song_title: newSongTitle,
        artist: newSongArtist,
        album: newSongAlbum,
      } as Song);
      this.setState({
        songs: this.state.songs,
        songAddedMessage: i18next.t("song-added"),
      });
    } else {
      this.setState({ songAddedMessage: i18next.t("song-not-added") });
    }
    // TODO: display creation result
  };

  handleDelete = async (song: Song) => {
    if (song.song_id && song.song_user_uuid === this.props.userUuid) {
      let result = await ControllerSongs.deleteSong(
        this.props.sessionHash,
        this.props.userUuid,
        song.song_id
      );
      if (result && this.state.songs) {
        let filtered = this.state.songs.filter(function (value: Song) {
          return value.song_id != song.song_id;
        });
        this.setState({ songs: filtered });
      }
    }
  };

  render = () => {
    return (
      <Grid
        container
        justifyContent={"center"}
        pt={3}
        columns={2}
        columnSpacing={3}
      >
        <Grid container item rowSpacing={3} xs={8}>
          <Grid container item xs={8} direction={"column"}>
            <Grid item xs={5}>
              <List>
                <ListSubheader>
                  <Typography variant={"h4"}>
                    {this.props.selectedPlaylist.playlist_title} by{" "}
                    {this.props.selectedPlaylistAuthor}
                  </Typography>
                </ListSubheader>
                {this.state.songs?.map((song) => (
                  <ListItem
                    key={song.song_id}
                    secondaryAction={
                      this.state.isOwner ? (
                        <IconButton
                          onClick={() => this.handleDelete(song)}
                          edge="end"
                          aria-label="delete"
                        >
                          <Delete />
                        </IconButton>
                      ) : null
                    }
                  >
                    <ListItemButton
                      onClick={() => {
                        this.setState({ selectedSongId: song.song_id });
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <MusicNote />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={song.song_title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {song.artist + " "}
                            </Typography>
                            {song.album}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction={"column"}>
              <Grid item>
                {this.state.selectedSongId ? (
                  <ViewSong
                    selectedPlaylistId={this.props.selectedPlaylist.playlist_id}
                    selectedSongId={this.state.selectedSongId}
                    userUuid={this.props.userUuid}
                    sessionHash={this.props.sessionHash}
                  />
                ) : (
                  <Typography align={"center"} variant={"h4"}>
                    {i18next.t("no-chosen-song").toString()}
                  </Typography>
                )}
              </Grid>
              <hr />
              {this.state.isOwner ? (
                <FormAddSong
                  songAddedMessage={this.state.songAddedMessage}
                  handleCreate={this.handleCreate}
                ></FormAddSong>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
}
