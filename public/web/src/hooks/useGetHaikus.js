import { useState, useEffect } from 'react';

const useGetHaikus = () => {
  const [haikus, setHaikus] = useState();

  const url = '/api/v1/haiku';
console.log(" URL: " + url);

  useEffect(() => {
    console.log('internal fetch useEffect...');
console.log(' In internal fetch..');
    fetch(url)
      .then((res) => res.json())
      .then((hlist) => {
console.log("  HLIST: " + JSON.stringify(hlist));
        let goodHaikus = [];
        for (let i = 0; i < hlist['haiku'].length; i++) {
          const h = hlist['haiku'][i];
          if (h.downvotes < 5 || (h.upvotes > h.downvotes)) {
            goodHaikus.push(h);
          }
        }
        setHaikus(goodHaikus);
      });
  }, [setHaikus]);

  console.log(" RETURNIGN HAIKUS: " + JSON.stringify(haikus));

  return [haikus];
};

export default useGetHaikus;
