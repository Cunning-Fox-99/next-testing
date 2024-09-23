'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';  // Импортируем компонент модального окна
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IProject, ProjectStatus, ParticipantStatus, IProjectOptional } from '@/types/project.type'; // Путь к вашему интерфейсу проекта

const ProjectsPage = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newProjectTitle, setNewProjectTitle] = useState('');
	const [eventDate, setEventDate] = useState<Date | null>(null);
	const [description, setDescription] = useState('');
	const [tags, setTags] = useState<string>('');
	const [projects, setProjects] = useState<IProjectOptional[]>([]);

	const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(ProjectStatus.ONGOING); // Начальный статус

	const handleProjectClick = (id: string) => {
		router.push(`/dashboard/project/${id}`);
	};

	const handleAddProject = async () => {
		if (newProjectTitle.trim() === '' || !eventDate) {
			alert('Пожалуйста, заполните обязательные поля: название и дата.');
			return;
		}
		const newProject: IProjectOptional = {
			title: newProjectTitle,
			eventDate: eventDate.toISOString(), // Преобразуем дату в строку
			description,
			tags: tags.split(',').map(tag => tag.trim()), // Преобразуем теги в массив
			status: ProjectStatus.DRAFT,
			participantStatus: ParticipantStatus.CLOSED,
			visibility: false,
		};

		try {
			const response = await fetch('/api/projects/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newProject),
			});

			if (!response.ok) {
				throw new Error('Ошибка при создании проекта');
			}

			const data = await response.json();
			setProjects([...projects, data.project]); // Обновляем список проектов
			setNewProjectTitle('');
			setEventDate(null);
			setDescription('');
			setTags('');
			setIsModalOpen(false); // Закрываем модальное окно
		} catch (error) {
			console.error('Ошибка при добавлении проекта:', error);
			alert('Ошибка при добавлении проекта. Пожалуйста, попробуйте снова.');
		}
	};


	const filteredProjects = projects.filter(project => project.status === selectedStatus);

	const fetchProjects = async () => {
		const response = await fetch('/api/projects');
		if (response.ok) {
			const data = await response.json();
			setProjects(data);
		} else {
			console.error('Ошибка при получении проектов');
		}
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6">Projects</h1>

			{/* Кнопка для добавления проекта */}
			<button
				className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6"
				onClick={() => setIsModalOpen(true)}
			>
				Add New Project
			</button>

			{/* Переключатель статусов */}
			<div className="mb-4">
				<button
					className={`px-4 mr-2 py-2 rounded-md ${selectedStatus === ProjectStatus.DRAFT ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
					onClick={() => setSelectedStatus(ProjectStatus.DRAFT)}
				>
					Draft
				</button>
				<button
					className={`px-4 mr-2 py-2 rounded-md ${selectedStatus === ProjectStatus.ONGOING ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
					onClick={() => setSelectedStatus(ProjectStatus.ONGOING)}
				>
					On Going
				</button>
				<button
					className={`px-4 mr-2 py-2 rounded-md ${selectedStatus === ProjectStatus.COMPLETED ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
					onClick={() => setSelectedStatus(ProjectStatus.COMPLETED)}
				>
					Completed
				</button>
				<button
					className={`px-4 py-2 rounded-md ${selectedStatus === ProjectStatus.CLOSED ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
					onClick={() => setSelectedStatus(ProjectStatus.CLOSED)}
				>
					Closed
				</button>
			</div>

			{/* Список проектов */}
			<div>
				<h2 className="text-lg font-medium mb-4">{selectedStatus === ProjectStatus.ONGOING ? 'Ongoing Projects' : 'Completed Projects'}</h2>
				{filteredProjects.length > 0 ? (
					<ul className="space-y-4">
						{filteredProjects.map((project) => (
							<li
								key={project._id}
								className="p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
								onClick={() => handleProjectClick(project._id!)}
							>
								{project.title}
							</li>
						))}
					</ul>
				) : (
					<p>No projects</p>
				)}
			</div>

			{/* Модальное окно для добавления проекта */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Project">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAddProject();
					}}
				>
					<input
						type="text"
						className="border p-2 w-full mb-4"
						placeholder="Project Title*"
						value={newProjectTitle}
						onChange={(e) => setNewProjectTitle(e.target.value)}
						required
					/>
					<label className="block mb-2">Date*</label>
					<DatePicker
						selected={eventDate}
						onChange={(date) => setEventDate(date)}
						dateFormat="yyyy/MM/dd h:mm aa" // Формат отображения даты и времени
						showTimeSelect // Включает выбор времени
						timeFormat="HH:mm" // Формат времени
						timeIntervals={15} // Интервал времени в минутах
						className="border rounded-md p-2 w-full mb-4"
						required
					/>
					<textarea
						className="border p-2 w-full mb-4"
						placeholder="Project description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={4}
					/>
					<input
						type="text"
						className="border p-2 w-full mb-4"
						placeholder="Tags, with comma"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
					<button
						type="submit"
						className="bg-green-500 text-white px-4 py-2 rounded-md"
					>
						Add Project
					</button>
				</form>
			</Modal>
		</div>
	);
};

export default ProjectsPage;
