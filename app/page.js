"use client";
import Head from 'next/head';
import { useFileSystemPublicRoutes } from '@/next.config';
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import he from 'he';

export default function Home() {

  const myref = useRef();

  const [data, setData] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [quesno, setQuesNo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [random, setRandom] = useState(0);
  const [allAns, setAllAns] = useState([]);
  const [ShuffledAllAns, setShuffledAllAllAns] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // correct sound




  const fetchData = () => {
    setLoading(true);
    fetch('https://opentdb.com/api.php?amount=10&difficulty=easy')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);





  const nextClicked = () => {
    myref.current.click();
    if (selectedAnswer === '') {
      alert('select one ans')
    } else {
      if (quesno < data.results.length - 1) {
        setQuesNo(quesno + 1);
        shuffleArray();
        console.log('selected ans is', selectedAnswer, 'and correct ans is', data.results[quesno].correct_answer);
        if (selectedAnswer === data.results[quesno].correct_answer) {
          setScore(score + 1)
          console.log(score);
          const audio = new Audio('/audio/correct2.wav');
          audio.play();
        } else {
          const audio = new Audio('/audio/incorrect.wav');
          audio.play();
        }
        setSelectedAnswer('')
      } else {
        setShowResult(true);
        const audio = new Audio('/audio/complete.mp3');
        audio.play();
        if (selectedAnswer === data.results[quesno].correct_answer) {
          setScore(score + 1)
          console.log(score);
          const audio = new Audio('/audio/correct2.wav');
          audio.play();
        } else {
          const audio = new Audio('/audio/incorrect.wav');
          audio.play();
        }
      }
    }


  }
  const shuffleArrayRandom = array => {
    const decodedString = data && he.decode(data.results[quesno].question);
    setQuestion(decodedString);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    };
    return (array)
  }

  const shuffleArray = () => {
    data && setAllAns(data.results[quesno].incorrect_answers);
    data && setAllAns(allAns => [...allAns, data.results[quesno].correct_answer]);
  }

  useEffect(() => {
    let shuffledAns = shuffleArrayRandom(allAns);
    setShuffledAllAllAns(shuffledAns);
    console.log(ShuffledAllAns);
  }, [allAns]);


  useEffect(() => {
    !isLoading && shuffleArray();
  }, [data]);
  useEffect(() => {
    !isLoading && shuffleArray();
  }, [quesno]);




  return (
    <div>
      <Head>
        <title>My page title</title>
      </Head>
      {
        isLoading ? <p className="w-full h-screen bg-cyan-600 text-white font-bold flex justify-center items-center">Loading...</p> : <div className="p-5 min-h-screen bg-blue-900">
          <div className="top">
            <h2 className="text-gray-200 text-2xl font-semibold text-center pt-5">Quiz App RR</h2>
          </div>
          <div className="bg-slate-50 sm:w-2/4 md:w-6/12 mx-auto p-5 rounded mt-5 pb-16">
            {
              showResult ? <div>
                {
                  score > 7 ? <div className='md:w-2/4 m-auto bg-green-400 py-2 rounded-sm'>
                    <h5 className="text-center font-semibold  text-lime-50">Congratulation</h5>
                  </div> : <div className='sm:w-2/4 m-auto bg-red-500 py-2 rounded-sm'>
                    <h5 className="text-center font-semibold  text-lime-50">Better Luck Next Time</h5>
                  </div>
                }
                {
                  score > 7 ? <div className="bg-green-600 text-center rounded-sm p-5 my-3">
                    <span className="text-gray-100 font-semibold text-2xl">You've Passed this Quiz Test</span>
                    <span className="text-gray-100 font-semibold text-1xl block">with</span>
                    <div className='bg-green-200 rounded-full h-24 w-24 flex items-center justify-center m-auto my-5'>
                      <span className="text-3xl font-bold text-green-900">{Math.floor((score / data.results.length) * 100)}%</span>
                    </div>
                    <span className="text-slate-200">Correct Answers</span>
                  </div> : <div className="bg-red-500 text-center rounded-sm p-5 my-3">
                    <span className="text-gray-100 font-semibold text-2xl">You've Failed this Quiz Test</span>
                    <span className="text-gray-100 font-semibold text-1xl block">with</span>
                    <div className='bg-green-200 rounded-full h-24 w-24 flex items-center justify-center m-auto my-5'>
                      <span className="text-3xl font-bold text-red-900">{Math.floor((score / data.results.length) * 100)}%</span>
                    </div>
                    <span className="text-slate-200">Correct Answers</span>
                  </div>
                }

                <span className='block text-center font-semibold text-3xl pt-5'>Your Score is {score > 7 ? <span className="text-green-600">{score}</span> : <span className="text-red-600">{score}</span>} /{data && data.results.length}</span>
              </div> :

                <div>
                  <div className='flex w-full justify-between'>
                    <div>
                      <span>{quesno + 1} of {data && data.results.length} Question </span>
                    </div>
                    {/* <div>
                      <span> ans is {data && data.results[quesno].correct_answer}</span>
                    </div> */}
                    {/* <div className="bg-green-400 px-5 py-1 rounded-md">
                      <span>{random} s</span>
                    </div> */}
                  </div>
                  <div>
                    <span className="mt-3 block font-bold text-slate-800 py-4">{data && question}</span>
                    <div>
                      <form action="">
                        {
                          ShuffledAllAns.map((ele, index) => {
                            return (
                              <div className="flex mt-2 border-2 p-2" key={index}>
                                <input
                                  type="radio"
                                  value={ele}
                                  id={index}
                                  name='same'
                                  className='block'
                                  onClick={() => setSelectedAnswer(ele)}
                                />
                                <label htmlFor={index} className=' block my-1 w-full cursor-pointer'><span className='pl-2'>{he.decode(ele)}</span></label>
                              </div>
                            )
                          })

                        }

                        <button className="hidden" type='reset' ref={myref}>reset</button>
                      </form>
                      <div>
                        <button className="float-right bg-gray-900 text-lime-50 px-3 py-1 rounded-lg mt-3" onClick={() => nextClicked()}>Next</button>
                      </div>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
      }
    </div>
  )
}
