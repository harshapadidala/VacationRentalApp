import React, { useState, useEffect } from "react";
import { Modal, Typography, Box, Divider, Button, Rating, TextField, CircularProgress } from "@mui/material";


export default function ExampleModal(props) {
  const { reviews, handleClose, handleAddReview, handleRatingChange, handleReviewChange, newReview, loading1, open } = props;


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          maxWidth: "800px",
          width: "100%",
          p: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reviews<button type="button" className="btn-close" aria-label="Close" style={{float:"right"}} onClick={handleClose}></button>
        </Typography>
        
        <Divider />
        <Box
          className="reviews-list"
          style={{ height: "250px", overflowY: "scroll", border: '1px solid black', padding: "4px", marginBottom:"10px"}}
        >
          {reviews.map((review) => (
            <Box key={review.id} className="review">
              <Typography variant="subtitle1" gutterBottom>
                <strong>{review.user}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {review.comment}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <span>Rating:</span>
                <Rating name="read-only" value={review.rating} precision={1} readOnly />
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="h5" gutterBottom>
          Add a review
        </Typography>
        <Divider />
        <Box className="add-review">
          <TextField
            name="comment"
            label="Add Review"
            value={newReview.comment}
            onChange={handleReviewChange}
            fullWidth
            margin="normal"
          />
          <Typography variant="subtitle2" gutterBottom>
            <span>Rating:</span>
            <Rating name="rating" value={newReview.rating} precision={1} onChange={handleRatingChange} />
          </Typography>
          <Button variant="contained" onClick={handleAddReview}>
            {loading1 ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Add Review"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
