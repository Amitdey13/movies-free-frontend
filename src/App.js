import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import $ from "jquery";

function Movie({ moviename, thumbnail }) {
  return (
    <span
      className="movie-card card bg-dark text-white p-1 m-5"
      style={{ width: "10rem" }}
    >
      <img
        className="card-img-top card-img"
        src={`http://localhost:8000/${thumbnail}`}
        alt="thumbnail"
      />
      <div className="card-img-overlay bg-title d-flex justify-content-end flex-column">
        <div className="card-title caveat fs-2">{moviename}</div>
      </div>
    </span>
  );
}

function App() {
  const [moviename, setMoviename] = useState("");
  const [releaseyear, setReleaseyear] = useState("");
  const [language, setLanguage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [video, setVideo] = useState("");
  const [movielist, setMovielist] = useState([]);

  //errors
  const [videoerror, setVideoerror] = useState("");
  const [thumbnailerror, setThumbnailerror] = useState("");

  const mymodal = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:8000/movies").then((response) => {
      if (response.data.success) {
        setMovielist(response.data.movies);
        console.log(movielist);
      } else {
        console.log(response.data.error);
      }
    });
    // eslint-disable-next-line
  }, []);

  const handlevideo = (e) => {
    setVideoerror("");
    setVideo(e.target.files[0]);
  };

  const handlethumbnail = (e) => {
    setThumbnailerror("");
    setThumbnail(e.target.files[0]);
  };

  const upload = (e) => {
    e.preventDefault();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    const uploadvideo = new FormData();
    uploadvideo.append("video", video);
    axios
      .post("http://localhost:8000/uploadvideo", uploadvideo, config)
      .then((response) => {
        if (response.data.success) {
          const videopath = response.data.filepath.split("\\").join("/");
          const uploadthumbnail = new FormData();
          uploadthumbnail.append("thumbnail", thumbnail);
          axios
            .post(
              "http://localhost:8000/uploadthumbnail",
              uploadthumbnail,
              config
            )
            .then((response) => {
              if (response.data.success) {
                // setThumbnailpath();
                const thumbnailpath = response.data.filepath
                  .split("\\")
                  .join("/");
                const data = {
                  moviename,
                  releaseyear,
                  language,
                  thumbnail: thumbnailpath,
                  video: videopath,
                };
                axios
                  .post("http://localhost:8000/upload", data)
                  .then((response) => {
                    if (response.data.success) {
                      // reset
                      e.target.reset();
                      setMoviename("");
                      setReleaseyear("");
                      setLanguage("");
                      setThumbnail("");
                      setVideo("");
                      $("#exampleModalCenter").modal("toggle");
                      axios
                        .get("http://localhost:8000/movies")
                        .then((response) => {
                          if (response.data.success) {
                            setMovielist(response.data.movies);
                          } else {
                            console.log(response.data.error);
                          }
                        });
                    } else {
                      console.log(response.data.error);
                    }
                  });
              } else {
                setThumbnailerror(response.data.error);
              }
            });
        } else {
          setVideoerror(response.data.error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App background">
      <nav className="navbar sticky-top navbar-expand-lg background">
        <div className="container-fluid d-flex justify-content-between">
          <span className="orange zcool fs-1">Movies Adda</span>
          <span
            className="orange roboto fs-2 pointer"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Add moives
          </span>
        </div>
      </nav>
      {/* Add movies modal */}
      <div
        className="modal fade"
        id="exampleModalCenter"
        ref={mymodal}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="border-0 orange modal-content">
            <div className="background modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Add movie
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span className="orange" aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body px-5 background">
              <form onSubmit={upload}>
                <div className="form-group">
                  <label htmlFor="moviename">Movie name</label>
                  <input
                    type="text"
                    name="moviename"
                    value={moviename}
                    onChange={(e) => setMoviename(e.target.value)}
                    className="form-control"
                    id="moviename"
                    aria-describedby="moviename"
                    placeholder="Movie name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="releaseyear">Year of release</label>
                  <input
                    type="text"
                    name="releaseyear"
                    value={releaseyear}
                    onChange={(e) => setReleaseyear(e.target.value)}
                    className="form-control"
                    id="releaseyear"
                    placeholder="Year of release"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-control"
                    id="language"
                    placeholder="Language"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="thumbnail">Thumbnail</label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handlethumbnail}
                    className="form-control-file"
                    id="thumbnail"
                    required
                  />
                  <small id="thumbnailHelp" className="form-text text-muted">
                    .jpg, .jpeg and .png of size less than 5mb are supported.
                  </small>
                  <p>
                    <strong className="red">{thumbnailerror}</strong>
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="video">Video</label>
                  <input
                    type="file"
                    name="video"
                    onChange={handlevideo}
                    className="form-control-file"
                    id="video"
                    required
                  />
                  <small id="videoHelp" className="form-text text-muted">
                    only .mp4 of size less than 50mb are supported.
                  </small>
                  <p>
                    <strong className="red">{videoerror}</strong>
                  </p>
                </div>
                <button type="submit reset" className="bg-orange btn-c">
                  Submit
                </button>
              </form>
            </div>
            <div className="modal-footer background"></div>
          </div>
        </div>
      </div>

      <div className="row m-0 line bg-orange" />
      <div className="movies-body container-fluid row m-0 background d-flex justify-content-center">
        {console.log(movielist)}
        {movielist.map((movie, index) => (
          <Movie key={index} {...movie} />
        ))}
      </div>
      <Pagination
        className="d-flex justify-content-center white"
        count={10}
        size="small"
      />
    </div>
  );
}

export default App;
