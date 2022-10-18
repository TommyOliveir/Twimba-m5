import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let currenttweetsData = tweetsData;

// localStorage.clear()
// localStorage.setItem('tweeted', JSON.stringify(tweetsData));
// const tweetsData2 = JSON.parse(localStorage.getItem("tweeted"))

const fromLocalStoragetweetsData = JSON.parse(localStorage.getItem("tweeted"));
console.log(fromLocalStoragetweetsData);

if (fromLocalStoragetweetsData) {
  currenttweetsData = fromLocalStoragetweetsData;
  render();
}

// Event listeners
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.delete) {
    handleDeleteClick(e.target.dataset.delete);
  } else if (e.target.id) {
    handleInputReplyClick(e.target.id);
  }
  else if (e.target.dataset.replysubmit) {
    handleReplySubmit(e.target.dataset.replysubmit);
  }

});

// HandleClicks
function handleLikeClick(tweetId) {
  const targetTweetObj = currenttweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
  console.log("like");
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = currenttweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    currenttweetsData.unshift({
      handle: `@TommyA.K.A.Spiderman`,
      profilePic: `images/spiderman.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    //save local here
    localStorage.setItem("tweeted", JSON.stringify(currenttweetsData));
    render();
    tweetInput.value = "";
  }
}

function handleDeleteClick(deleteID) {
  const resultNotdeleted = currenttweetsData.filter(function (del) {
    return del.uuid !== deleteID;
  });
  console.log(resultNotdeleted);
  currenttweetsData = resultNotdeleted;
  localStorage.setItem("tweeted", JSON.stringify(currenttweetsData));
  render();
}


function handleInputReplyClick(inputreplyID) {


  // console.log(inputreplyID)
}


function handleReplySubmit(replySubmit) {

  let replyText = document.getElementById(`inputReply-ID-${replySubmit}`)

  console.log(replyText.value)
  console.log(replySubmit)

  const addReply = currenttweetsData.filter(function (replydata) {
    return replydata.uuid === replySubmit

  })

  if (replyText.value) {
    addReply[0].replies.push({
      handle: `@TommyA.K.A.Spiderman`,
      profilePic: `images/spiderman.jpg`,
      tweetText: `${replyText.value}`,
    })
    localStorage.setItem("tweeted", JSON.stringify(currenttweetsData));
    render()
    console.log(currenttweetsData)


    document.getElementById(`replies-${replySubmit}`).classList.remove("hidden");
  }



  // if(replyText.value) {
  //   console.log(addReply)
  //   console.log(addReply[0].replies)

  // }



};





// getFeedHtml
function getFeedHtml() {
  //local

  let feedHtml = ``;

  currenttweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = ``;

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
                                <div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${reply.profilePic}" class="profile-pic">
                                            <div>
                                                <p class="handle">${reply.handle}</p>
                                                <p class="tweet-text">${reply.tweetText}</p>
                                                
                                            </div>
                                        </div>
                                    
                                </div>
                                
                                `;
      });
    }

    feedHtml += `                   
                    <div class="tweet">
                        <div class="tweet-inner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                                <div class="tweet-details">
                                    <span class="tweet-detail">
                                        <i class="fa-regular fa-comment-dots"
                                        data-reply="${tweet.uuid}"
                                        ></i>
                                        ${tweet.replies.length}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}"
                                        data-like="${tweet.uuid}"
                                        ></i>
                                        ${tweet.likes}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                                        data-retweet="${tweet.uuid}"
                                        ></i>
                                        ${tweet.retweets}
                                    </span>
                                    
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-trash"
                                        data-delete="${tweet.uuid}"></i>                                    
                                    </span>

                                </div>   
                            </div>            
                        </div>
                        <div class="hidden" id="replies-${tweet.uuid}">
                          <div class="tweet-reply"> 
                            <div class="tweet-reply-flex" >
                              <img src="images/spiderman.jpg" class="profile-pic tweet-inner"  >
        
                              <textarea placeholder="Add Comment" style="overflow:hidden" id="inputReply-ID-${tweet.uuid}" name="inputReply" data-inputreply="${tweet.uuid}"></textarea> 
                            </div>
                            <div>  
                              <button class="reply-btn" data-replysubmit="${tweet.uuid}">reply</button>  
                            </div>
                                    
                          </div>

                            ${repliesHtml}
                        </div>   
                    </div>
                  `;
  });

  return feedHtml;
}

// render
function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
