import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

interface Photo {
	id: number;
	title: string;
	url: string;
	thumbnailUrl: string;
}

const fetchPhotos = async (page: number): Promise<Photo[]> => {
	const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`);
	return res.json();
};

const InfiniteScroll: React.FC = () => {
	const [page, setPage] = useState<number>(1);
	const [photos, setPhotos] = useState<Photo[]>([]);
	const observerRef = useRef<HTMLDivElement | null>(null);
	
	const { data, error, isLoading } = useQuery(['photos', page], () => fetchPhotos(page), {
		keepPreviousData: true,
	});
	
	useEffect(() => {
		if (data) {
			setPhotos((prevPhotos) => [...prevPhotos, ...data]);
		}
	}, [data]);
	
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setPage((prevPage) => prevPage + 1);
			}
		});
		
		if (observerRef.current) {
			observer.observe(observerRef.current);
		}
		
		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, []);
	
	if (error) return <div>Failed to load</div>;
	
	return (
		<div>
			<h1>Infinite Scroll</h1>
			<div>
				{photos.map((photo) => (
					<div key={photo.id}>
						<img src={photo.thumbnailUrl} alt={photo.title} />
						<p>{photo.title}</p>
					</div>
				))}
			</div>
			{isLoading && <p>Loading...</p>}
			<div ref={observerRef} style={{ height: '1px' }}></div>
		</div>
	);
};

export default InfiniteScroll;
