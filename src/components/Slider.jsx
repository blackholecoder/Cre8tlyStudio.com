import { useEffect, useState, useRef } from "react";
import { ReviewCard } from "../sections";
import { register } from "swiper/element/bundle";


register();
const Slider = () => {
  const [slides] = useState([
    {
      id: 1,
      customerName: "Jay M",
      feedback:
        "Drama deserves the spotlight, his music is incredible and reaches those who are broken",
    },

    {
      id: 2,
      customerName: "Toby D",
      feedback:
        "Drama's music is timeless.",
    },
    {
      id: 3,
      customerName: "Lorie N",
      feedback:
      "I love my husband and his music is just a perk to be married to him",
    },
    
    {
      id: 5,
      customerName: "Donna D",
      feedback:
        "Been a believer since day 1",
    }, 
    {
      id: 6,
      customerName: "Regina P",
      feedback:
        "Drama is definitely on fire he's reaching for the stars for sure yes Lord has giving him a talent like no other",
    }, 
    {
      id: 7,
      customerName: "Laura F",
      feedback:
        "I have all of his song son my playlist, I am a major fan!",
    }, 
    {
      id: 8,
      customerName: "Marilyn E",
      feedback:
        "Drama has Absolutely AMAZING MUSIC!!!! ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️",
    }, 
    {
      id: 9,
      customerName: "Julie C",
      feedback:
        "l am loving everything Drama puts out, incredible talent!",
    }, 
    {
      id: 10,
      customerName: "Glen L",
      feedback:
        "I love Drama's music, he is a fresh breath of air in the music industry!",
    }, 
    {
      id: 11,
      customerName: "Andrew H",
      feedback:
        "Drama inspires me to be a better person, with his music I feel alive again",
    }, 
    {
      id: 12,
      customerName: "Crystal P",
      feedback:
        "Drama is an inspiration to us all that are shattered from abuse",
    }, 
    {
      id: 13,
      customerName: "Penny A",
      feedback:
        "I can't stop listening to Drama's music, it's so good, I love it!!",
    }, 
    {
      id: 14,
      customerName: "Paris F",
      feedback:
        "Drama is going to be famous one day and I am lucky to have gotten to know him, his music will inspire generations to come",
    }, 
    {
      id: 15,
      customerName: "Shawn J",
      feedback:
        "Drama's music is life changing and thats why I rock with him, he is my family. He is the change we all need in the world. ",
    }, 
  ]);

  const swiperRef = useRef(null);

  useEffect(() => {
    const swiperContainer = swiperRef.current;
    const params = {
      navigation: true,
      pagination: true,
      // spaceBetween: 50,
      centeredSlides: true,
      autoplay: {
      delay: 8000,               // slow down to 20 seconds
      disableOnInteraction: false,
    },
      disableOnInteraction: false,
      slidesPerView: 1,
      breakpoints: {
        300: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        864: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1400: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },

      effect: true,
      loop: true,
      followFinger: true,
      injectStyles: [
        `
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
          .swiper-pagination-bullet{
            width: 10px;
            height: 10px;
            background-color: #670fe7;
            position: relative;
            bottom: 5px;
            
          }

          .swiper-container {
            width: 450px;
          }

          
          @media screen and (min-width: 640px) {
            .swiper-container {
              width: 640px;
            }
          }
          
          @media screen and (min-width: 768px) {
            .swiper-container {
              width: 768px;
            }
          }
      `,
      ],
    };

    Object.assign(swiperContainer, params);
    swiperContainer.initialize();
  }, []);

  return (
    <swiper-container  className='z-1' ref={swiperRef} init="false">
      {slides.map((slide) => {
        return (
          <swiper-slide key={slide.id}>
            <div className='pb-10'>
            <ReviewCard {...slide} />
            </div>
          </swiper-slide>
        );
      })}
    </swiper-container>
  );
};

export default Slider;
