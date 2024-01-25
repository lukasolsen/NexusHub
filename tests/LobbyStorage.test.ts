import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import LobbyStorage from "../socket-server/src/LobbyStorage";
import { CustomSocket } from "../shared/types/essential";
import { Socket } from "socket.io";

const fakeSocket = {
  name: "test",
  id: "123",
  rooms: new Set(),
  userId: "123",
  ...Socket.prototype,
} as CustomSocket;

let lobbyId = "";

describe("LobbyStorage", () => {
  const lobbyStorage = LobbyStorage.getInstance();

  // Make sure that the lobby storage is empty before each test, to avoid conflicts

  beforeEach(() => {
    if (lobbyStorage.getLobbies().size > 0) {
      // Return, not allowed to test if there are lobbies in the storage
      return;
    }
  });

  test("getLobbies", () => {
    expect(lobbyStorage.getLobbies().size).toBe(0);
  });

  test("Create Lobby", () => {
    const lobby = lobbyStorage.createLobby(fakeSocket);

    lobbyId = lobby.id;
    console.log(lobby);

    expect(lobbyStorage.getLobbies().size).toBe(1);
    expect(lobbyStorage.getLobbies().get(lobby.id)).toBeDefined();
  });

  test("Get Lobbies", () => {
    expect(lobbyStorage.getLobbies().size).toBe(1);
    expect(lobbyStorage.getLobbies()).toBeDefined();
  });

  test("Get Lobby From Id", () => {
    const lobby = lobbyStorage.getLobbies().get(lobbyId);
    expect(lobby).toBeDefined();
    expect(lobby?.id).toBe(lobbyId);
  });

  test("Get User from Lobby", () => {
    const user = lobbyStorage.findUserFromLobby(lobbyId, fakeSocket.id);

    expect(user).toBeDefined();
    expect(user?.id).toBe(fakeSocket.id);
  });

  test("Get Lobby from Socket ID", () => {
    const lobby = lobbyStorage.getLobbiesFromSocketID(fakeSocket.id);

    expect(lobby).toBeDefined();
    expect(lobby?.id).toBe(lobbyId);
  });

  test("Get non-existing user from Lobby", () => {
    const user = lobbyStorage.findUserFromLobby(lobbyId, "1234");

    expect(user).toBeUndefined();
  });

  test("Get non-existing lobby", () => {
    const lobby = lobbyStorage.getLobbyFromId("1234");

    expect(lobby).toBeUndefined();
  });

  test("Remove Lobby", () => {
    const lobby = lobbyStorage.getLobbies().get(lobbyId);
    expect(lobby).toBeDefined();

    lobbyStorage.removeLobby(lobbyId);
    expect(lobbyStorage.getLobbies().size).toBe(0);
  });
});
