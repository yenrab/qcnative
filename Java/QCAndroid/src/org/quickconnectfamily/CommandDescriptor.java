package org.quickconnectfamily;

import java.util.HashMap;

public class CommandDescriptor {
	private String cmd;
	private HashMap<Object, Object> parameters;
	private StackCallback callback;
	private boolean runInBackground;
	
	
	
	public CommandDescriptor(String cmd, HashMap<Object, Object> parameters,
			StackCallback callback, boolean runInBackground) {
		super();
		this.cmd = cmd;
		this.parameters = parameters;
		this.callback = callback;
		this.runInBackground = runInBackground;
	}
	public String getCommand() {
		return cmd;
	}
	public HashMap<Object,Object> getData() {
		return parameters;
	}
	public StackCallback getCallback() {
		return callback;
	}
	public boolean runInBackground(){
		return runInBackground;
	}
	
	
}
