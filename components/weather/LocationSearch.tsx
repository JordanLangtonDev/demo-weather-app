'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useWeather } from '@/contexts/WeatherContext';
import { weatherAPI } from '@/lib/weather-api';
import { locationService, LocationSuggestion } from '@/lib/location-service';

export function LocationSearch() {
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
	const [recent, setRecent] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [highlight, setHighlight] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const suppressSuggestionsRef = useRef(false);

	const { state, dispatch } = useWeather();
	const { loading } = state;

	// Helper: search by free-text label (geocoding first, then weather)
	const searchFromLabel = async (label: string) => {
		dispatch({ type: 'SET_LOADING', payload: true });
		try {
			const results = await locationService.searchLocations(label, 1);
			if (results.length > 0) {
				await performSearchWithLocation(results[0]);
			} else {
				dispatch({ type: 'SET_LOADING', payload: false });
			}
		} catch (err) {
			dispatch({ type: 'SET_LOADING', payload: false });
			throw err;
		}
	};

	// Persist and manage recent searches
	const persistRecent = (cityLabel: string) => {
		setRecent(prev => {
			const next = [cityLabel, ...prev.filter(c => c.toLowerCase() !== cityLabel.toLowerCase())].slice(0, 8);
			try { localStorage.setItem('recentLocations', JSON.stringify(next)); } catch {}
			return next;
		});
	};

	const performSearchWithLocation = async (loc: LocationSuggestion) => {
		dispatch({ type: 'SET_LOADING', payload: true });
		dispatch({ type: 'SET_ERROR', payload: null });
		try {
			// Update location in context
			dispatch({
				type: 'SET_LOCATION',
				payload: {
					city: loc.name,
					state: loc.region,
					country: loc.country,
					lat: loc.lat,
					lon: loc.lon,
				}
			});

			// Current weather
			const currentWeather = await weatherAPI.getCurrentWeather(loc.lat, loc.lon);
			dispatch({ type: 'SET_CURRENT_WEATHER', payload: currentWeather });

			// Forecast (8 days to ensure we get 3 forecast days after excluding today)
			const forecast = await weatherAPI.getForecast(loc.lat, loc.lon, 8);
			dispatch({ type: 'SET_FORECAST', payload: forecast });

			// Historical weather (past 3 days)
			const endDate = new Date();
			endDate.setDate(endDate.getDate() - 1); // Yesterday
			const startDate = new Date();
			startDate.setDate(startDate.getDate() - 3); // 3 days ago
			
			const historicalWeather = await weatherAPI.getHistoricalWeather(
				loc.lat, 
				loc.lon, 
				startDate.toISOString().split('T')[0], 
				endDate.toISOString().split('T')[0]
			);
			dispatch({ type: 'SET_HISTORY', payload: historicalWeather });

			// Selected date = today
			const today = new Date();
			const dateString = today.toISOString().split('T')[0];
			dispatch({ type: 'SET_SELECTED_DATE', payload: dateString });

			// Save to recent
			const label = [loc.name, loc.region].filter(Boolean).join(', ');
			persistRecent(label);
		} catch (error) {
			console.error('Search failed:', error);
			let errorMessage = 'Unable to fetch weather for this location.';
			if (error instanceof Error) errorMessage = error.message;
			dispatch({ type: 'SET_ERROR', payload: errorMessage });
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
			// Re-enable suggestions after this selection cycle
			suppressSuggestionsRef.current = false;
		}
	};

	const handleSearch = async () => {
		const q = searchQuery.trim();
		if (!q) return;
		setOpen(false);
		await searchFromLabel(q);
	};

	const handleKeyDown = async (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (open && (suggestions.length > 0 || recent.length > 0)) {
				if (suggestions.length > 0) {
					const s = suggestions[highlight];
					const label = [s.name, s.region].filter(Boolean).join(', ');
					// Suppress suggestions for this selection
					suppressSuggestionsRef.current = true;
					setSearchQuery(label || s.display_name);
					setOpen(false);
					setSuggestions([]);
					await performSearchWithLocation(s);
				} else {
					const label = recent[highlight];
					// Suppress suggestions for this selection
					suppressSuggestionsRef.current = true;
					setSearchQuery(label);
					setOpen(false);
					setSuggestions([]);
					await searchFromLabel(label);
				}
			} else {
				await handleSearch();
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const max = (suggestions.length || recent.length) - 1;
			setHighlight(h => Math.min(h + 1, Math.max(0, max)));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setHighlight(h => Math.max(h - 1, 0));
		} else if (e.key === 'Escape') {
			setOpen(false);
		}
	};

	const handleFocus = () => {
		// Show recent searches when input is focused
		if (recent.length > 0) {
			setOpen(true);
			setHighlight(0);
		}
	};

	// Debounced suggestions
	useEffect(() => {
		let active = true;
		// If we're suppressing suggestions due to a selection, skip this cycle
		if (suppressSuggestionsRef.current) {
			setIsLoadingSuggestions(false);
			setSuggestions([]);
			setOpen(false);
			return () => { active = false; };
		}

		const q = searchQuery.trim();
		if (q.length < 2) {
			setSuggestions([]);
			setIsLoadingSuggestions(false);
			// Keep dropdown open for recent searches if no suggestions
			if (recent.length > 0) {
				setOpen(true);
			} else {
				setOpen(false);
			}
			return () => { active = false; };
		}
		setIsLoadingSuggestions(true);
		const t = setTimeout(async () => {
			try {
				const s = await locationService.searchLocations(q, 7);
				if (!active) return;
				setSuggestions(s);
				setOpen(s.length > 0 || recent.length > 0);
				setHighlight(0);
			} catch (err) {
				console.error('Suggestion fetch failed:', err);
				if (!active) return;
				setSuggestions([]);
				// Keep dropdown open for recent searches even if suggestions fail
				setOpen(recent.length > 0);
			} finally {
				if (active) setIsLoadingSuggestions(false);
			}
		}, 220);
		return () => { active = false; clearTimeout(t); };
	}, [searchQuery, recent.length]);

	// Load recent and outside click handler
	useEffect(() => {
		try {
			const stored = localStorage.getItem('recentLocations');
			if (stored) setRecent(JSON.parse(stored));
		} catch {}
		const onClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, []);

	return (
		<div className="w-full relative" ref={containerRef}>
			<div className="relative">
				<Input
					aria-label="Search for cities"
					autoComplete="off"
					type="text"
					placeholder="Search for cities"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					className="h-12 md:h-12 w-full rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder-gray-400 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 pr-12"
				/>

				{/* Loading indicator for suggestions and searches */}
				{((isLoadingSuggestions && searchQuery.trim().length >= 2) || loading) && (
					<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
						<div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
					</div>
				)}

				{/* Dropdown */}
				{open && (suggestions.length > 0 || recent.length > 0) && (
					<div className="absolute top-full mt-2 left-0 right-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden z-50">
						<div className="max-h-72 overflow-auto">
							{/* Show suggestions first, then recent searches */}
							{suggestions.length > 0 ? (
								suggestions.map((s, idx) => {
									const label = [s.name, s.region].filter(Boolean).join(', ');
									const active = idx === highlight;
									return (
										<button
											key={`suggestion-${idx}`}
											onMouseDown={(e) => e.preventDefault()}
											onClick={async () => { suppressSuggestionsRef.current = true; setOpen(false); setSuggestions([]); setSearchQuery(label || s.display_name); await performSearchWithLocation(s); }}
											className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
										>
											{label || s.display_name}
										</button>
									);
								})
							) : (
								<>
									{/* Recent searches header */}
									<div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
										Recent Searches
									</div>
									{/* Recent searches list */}
									{recent.map((r, idx) => {
										const active = idx === highlight;
										return (
											<button
												key={`recent-${idx}`}
												onMouseDown={(e) => e.preventDefault()}
												onClick={async () => {
													suppressSuggestionsRef.current = true;
													setOpen(false);
													setSuggestions([]);
													setSearchQuery(r);
													await searchFromLabel(r);
												}}
												className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
											>
												<div className="flex items-center justify-between">
													<span>{r}</span>
													{/* <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">💾 Cached</span> */}
												</div>
											</button>
										);
									})}
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
