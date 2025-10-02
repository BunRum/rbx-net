--Compiled with roblox-ts v1.3.3
local TS = require(script.Parent.Parent.rbxts_include.RuntimeLib)
local ClientMiddlewareFunction
do
	ClientMiddlewareFunction = {}
	function ClientMiddlewareFunction:constructor(middlewares)
		if middlewares == nil then
			middlewares = {}
		end
		self.middlewares = middlewares
	end
	function ClientMiddlewareFunction:_use(middleware)
		local _exp = (self.middlewares)
		table.insert(_exp, middleware)
	end
	function ClientMiddlewareFunction:_processMiddleware(callback)
		local _binding = self
		local middlewares = _binding.middlewares
		local _exitType, _returns = TS.try(function()
			if #middlewares > 0 then
				local callbackFn = callback
				-- Run through each middleware
				for _, middleware in ipairs(middlewares) do
					callbackFn = middleware(callbackFn, self)
				end
				return TS.TRY_RETURN, { callbackFn }
			else
				return TS.TRY_RETURN, { callback }
			end
		end, function(e)
			warn("[rbx-net] " .. tostring(e))
		end)
		if _exitType then
			return unpack(_returns)
		end
	end
	function ClientMiddlewareFunction:process(arr)
		local _binding = self
		local middlewares = _binding.middlewares
		if #middlewares > 0 then
			for _, middleware in ipairs(middlewares) do
			end
		end
	end
end
local default = ClientMiddlewareFunction
return {
	default = default,
}
